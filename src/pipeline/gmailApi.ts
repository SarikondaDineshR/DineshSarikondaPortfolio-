import type { GmailLabel, PipelineThread, Stage, ThreadMessage } from "./types";
import { LABEL_STAGE_PRIORITY, SYNC_LABEL_NAMES } from "./theme";

const BASE = "https://gmail.googleapis.com/gmail/v1/users/me";

async function gmailFetch(token: string, path: string, init: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || `Gmail said ${res.status}`);
  }
  return res.json();
}

export async function listLabels(token: string): Promise<GmailLabel[]> {
  const data = await gmailFetch(token, "/labels");
  return (data.labels || []).filter((l: GmailLabel) => l.type === "user");
}

export async function ensureLabel(token: string, name: string, labels: GmailLabel[]): Promise<GmailLabel> {
  const existing = labels.find((l) => l.name === name);
  if (existing) return existing;
  return gmailFetch(token, "/labels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, labelListVisibility: "labelShow", messageListVisibility: "show" }),
  });
}

function headerValue(headers: Array<{ name: string; value: string }>, name: string) {
  return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || "";
}

function parseFrom(raw: string): { name: string; email: string } {
  const m = raw.match(/^(?:"?([^"<]*)"?\s*)?<?([^<>\s]+@[^<>\s]+)>?$/);
  if (!m) return { name: raw, email: raw };
  return { name: (m[1] || m[2]).trim(), email: m[2].trim() };
}

function deriveStage(labelNames: Set<string>): Stage {
  for (const { label, stage } of LABEL_STAGE_PRIORITY) {
    if (labelNames.has(label)) return stage;
  }
  return "action_needed";
}

function base64UrlDecode(data: string): string {
  const b64 = data.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder("utf-8").decode(bytes);
}

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function extractBody(payload: any): string {
  if (!payload) return "";
  if (payload.mimeType === "text/plain" && payload.body?.data) return base64UrlDecode(payload.body.data);
  if (payload.parts) {
    const plain = payload.parts.find((p: any) => p.mimeType === "text/plain");
    if (plain?.body?.data) return base64UrlDecode(plain.body.data);
    const html = payload.parts.find((p: any) => p.mimeType === "text/html");
    if (html?.body?.data) return base64UrlDecode(html.body.data).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    for (const p of payload.parts) {
      const nested = extractBody(p);
      if (nested) return nested;
    }
  }
  if (payload.mimeType === "text/html" && payload.body?.data) {
    return base64UrlDecode(payload.body.data).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  return "";
}

function buildSyncQuery(labels: GmailLabel[]): string {
  const names = labels.filter((l) => SYNC_LABEL_NAMES.includes(l.name)).map((l) => `label:"${l.name}"`);
  const scope = names.length ? `(${names.join(" OR ")})` : "";
  return `newer_than:21d ${scope}`.trim();
}

export async function searchThreadIds(token: string, query: string, maxResults = 20): Promise<string[]> {
  const data = await gmailFetch(token, `/threads?q=${encodeURIComponent(query)}&maxResults=${maxResults}`);
  return (data.threads || []).map((t: any) => t.id);
}

export async function getThreadSummary(token: string, id: string, ownEmail: string): Promise<PipelineThread> {
  const data = await gmailFetch(
    token,
    `/threads/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`
  );
  const messages = data.messages || [];
  const last = messages[messages.length - 1];
  const labelIds: string[] = Array.from(new Set(messages.flatMap((m: any) => m.labelIds || [])));
  const fromMsg = messages.slice().reverse().find((m: any) => {
    const from = parseFrom(headerValue(m.payload.headers, "From"));
    return from.email.toLowerCase() !== ownEmail.toLowerCase();
  }) || last;
  const from = parseFrom(headerValue(fromMsg.payload.headers, "From"));
  const subject = headerValue(last.payload.headers, "Subject") || "(no subject)";
  const domain = from.email.split("@")[1] || "";
  return {
    id,
    subject,
    snippet: last.snippet || "",
    contactName: from.name || from.email,
    contactEmail: from.email,
    domain,
    stage: "action_needed",
    labelIds,
    lastActivity: new Date(Number(last.internalDate)).toISOString().slice(0, 10),
    pinned: false,
  };
}

export async function syncThreads(token: string, ownEmail: string, labels: GmailLabel[], known: Set<string> = new Set()): Promise<PipelineThread[]> {
  const query = buildSyncQuery(labels);
  const ids = await searchThreadIds(token, query, 20);
  const fresh = ids.filter((id) => !known.has(id));
  const labelNameById = new Map(labels.map((l) => [l.id, l.name]));
  const summaries = await Promise.all(fresh.map((id) => getThreadSummary(token, id, ownEmail)));
  return summaries.map((t) => {
    const names = new Set(t.labelIds.map((lid) => labelNameById.get(lid)).filter(Boolean) as string[]);
    return { ...t, stage: deriveStage(names) };
  });
}

export async function searchByLabel(token: string, ownEmail: string, labels: GmailLabel[], labelName: string, maxResults = 15): Promise<PipelineThread[]> {
  const ids = await searchThreadIds(token, `label:"${labelName}"`, maxResults);
  const labelNameById = new Map(labels.map((l) => [l.id, l.name]));
  const summaries = await Promise.all(ids.map((id) => getThreadSummary(token, id, ownEmail)));
  return summaries.map((t) => {
    const names = new Set(t.labelIds.map((lid) => labelNameById.get(lid)).filter(Boolean) as string[]);
    return { ...t, stage: deriveStage(names) };
  });
}

export async function getThreadMessages(token: string, id: string, ownEmail: string): Promise<ThreadMessage[]> {
  const data = await gmailFetch(token, `/threads/${id}?format=full`);
  return (data.messages || []).map((m: any) => {
    const from = parseFrom(headerValue(m.payload.headers, "From"));
    return {
      id: m.id,
      from: from.name || from.email,
      email: from.email,
      date: new Date(Number(m.internalDate)).toISOString(),
      body: extractBody(m.payload) || m.snippet || "",
      self: from.email.toLowerCase() === ownEmail.toLowerCase(),
    };
  });
}

export async function modifyThreadLabels(token: string, id: string, addLabelIds: string[], removeLabelIds: string[]) {
  return gmailFetch(token, `/threads/${id}/modify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ addLabelIds, removeLabelIds }),
  });
}

export async function createDraft(token: string, to: string, subject: string, body: string) {
  const raw = [`To: ${to}`, `Subject: ${subject}`, 'Content-Type: text/plain; charset="UTF-8"', "MIME-Version: 1.0", "", body].join("\r\n");
  return gmailFetch(token, "/drafts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: { raw: base64UrlEncode(raw) } }),
  });
}
