import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshCw, Mail, Radio, ChevronRight, ChevronLeft, Send, CheckCircle2, AlertTriangle,
  Loader2, Pin, Inbox, Search, Sun, Moon, X, Plus, Copy, LogOut, KeyRound,
} from "lucide-react";
import { THEMES, STAGE_META, OPEN_STAGES, STAGE_TO_LABEL } from "./theme";
import type { ThemeName } from "./theme";
import type { GmailAccount, GmailLabel, PipelineThread, AccountData } from "./types";
import { getClientId, requestAccessToken, fetchUserInfo } from "./google";
import { listLabels, syncThreads, searchByLabel, getThreadMessages, modifyThreadLabels, ensureLabel, createDraft } from "./gmailApi";
import {
  loadAccounts, saveAccounts, loadActiveEmail, saveActiveEmail, loadAccountData, saveAccountData, removeAccountData,
} from "./storage";

function daysSince(s: string) { return Math.max(0, Math.round((Date.now() - new Date(s + "T00:00:00").getTime()) / 86400000)); }
function fmtDate(s: string) { return new Date(s + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" }); }
function initials(name: string) { return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase(); }

interface TokenEntry { token: string; expiresAt: number }

export default function PipelineControl() {
  const [theme, setTheme] = useState<ThemeName>("dark");
  const T = THEMES[theme];
  const col = (name: string) => (T as any)[name] || name;

  const clientId = getClientId();

  const [accounts, setAccounts] = useState<GmailAccount[]>(() => loadAccounts());
  const [activeEmail, setActiveEmail] = useState<string | null>(() => loadActiveEmail());
  const [tokens, setTokens] = useState<Record<string, TokenEntry>>({});
  const [dataByAccount, setDataByAccount] = useState<Record<string, AccountData>>({});
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [errBanner, setErrBanner] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; tone?: "ok" | "err" } | null>(null);

  const [filter, setFilter] = useState<{ kind: "all" | "stage" | "label"; value: string | null; label: string }>({ kind: "all", value: null, label: "All threads" });
  const [searchQ, setSearchQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [threadOpen, setThreadOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [compose, setCompose] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [labelLoading, setLabelLoading] = useState<string | null>(null);

  const activeAccount = accounts.find((a) => a.email === activeEmail) || null;
  const activeData = activeEmail ? dataByAccount[activeEmail] || { labels: [], threads: [], notes: {}, lastSync: null } : { labels: [], threads: [], notes: {}, lastSync: null };
  const activeToken = activeEmail ? tokens[activeEmail] : undefined;
  const hasLiveToken = !!activeToken && activeToken.expiresAt > Date.now();

  function showToast(msg: string, tone: "ok" | "err" = "ok") { setToast({ msg, tone }); setTimeout(() => setToast(null), 3600); }

  // hydrate cached per-account data on mount / when accounts change
  useEffect(() => {
    const next: Record<string, AccountData> = {};
    accounts.forEach((a) => { next[a.email] = loadAccountData(a.email); });
    setDataByAccount(next);
  }, [accounts]);

  function persistAccountData(email: string, patch: Partial<AccountData>) {
    setDataByAccount((prev) => {
      const merged = { ...(prev[email] || { labels: [], threads: [], notes: {}, lastSync: null }), ...patch };
      saveAccountData(email, merged);
      return { ...prev, [email]: merged };
    });
  }

  async function connectAccount() {
    if (!clientId) { setErrBanner("Add a Google OAuth Client ID (VITE_GOOGLE_CLIENT_ID) before connecting a Gmail account."); return; }
    setConnecting(true); setErrBanner(null);
    try {
      const resp = await requestAccessToken({ interactive: true });
      const info = await fetchUserInfo(resp.access_token);
      setTokens((prev) => ({ ...prev, [info.email]: { token: resp.access_token, expiresAt: Date.now() + resp.expires_in * 1000 } }));
      setAccounts((prev) => {
        const exists = prev.some((a) => a.email === info.email);
        const next = exists ? prev.map((a) => (a.email === info.email ? info : a)) : [...prev, info];
        saveAccounts(next);
        return next;
      });
      setActiveEmail(info.email); saveActiveEmail(info.email);
      showToast(`Connected ${info.email}`);
    } catch (e: any) {
      showToast(e.message || "Couldn't connect that Gmail account", "err");
    } finally { setConnecting(false); }
  }

  async function reconnectAccount(email: string, interactive: boolean) {
    try {
      const resp = await requestAccessToken({ interactive, hint: email });
      setTokens((prev) => ({ ...prev, [email]: { token: resp.access_token, expiresAt: Date.now() + resp.expires_in * 1000 } }));
      return resp.access_token;
    } catch (e: any) {
      if (interactive) showToast(e.message || `Couldn't reconnect ${email}`, "err");
      return null;
    }
  }

  function switchAccount(email: string) {
    setActiveEmail(email); saveActiveEmail(email);
    setFilter({ kind: "all", value: null, label: "All threads" });
    setSelectedId(null); setThreadOpen(false);
    const entry = tokens[email];
    if (!entry || entry.expiresAt <= Date.now()) reconnectAccount(email, false);
  }

  function removeAccount(email: string) {
    setAccounts((prev) => { const next = prev.filter((a) => a.email !== email); saveAccounts(next); return next; });
    setTokens((prev) => { const next = { ...prev }; delete next[email]; return next; });
    setDataByAccount((prev) => { const next = { ...prev }; delete next[email]; return next; });
    removeAccountData(email);
    if (activeEmail === email) { setActiveEmail(null); saveActiveEmail(null); }
    showToast(`Disconnected ${email}`);
  }

  async function ensureToken(): Promise<string | null> {
    if (!activeEmail) return null;
    const entry = tokens[activeEmail];
    if (entry && entry.expiresAt > Date.now()) return entry.token;
    const t = await reconnectAccount(activeEmail, true);
    return t;
  }

  const sync = useCallback(async () => {
    if (!activeEmail) { showToast("Connect a Gmail account first", "err"); return; }
    setSyncing(true); setErrBanner(null);
    try {
      const token = await ensureToken();
      if (!token) throw new Error("Reconnect this Gmail account to sync");
      const labels = await listLabels(token);
      const known = new Set((activeData.threads || []).map((t) => t.id));
      const fresh = await syncThreads(token, activeEmail, labels, known);
      persistAccountData(activeEmail, { labels, threads: [...fresh, ...(activeData.threads || [])], lastSync: new Date().toISOString() });
      showToast(fresh.length ? `Found ${fresh.length} thread${fresh.length > 1 ? "s" : ""}` : "No new job threads in the last 21 days");
    } catch (e: any) {
      setErrBanner(e.message || "Sync failed. Your saved data is unaffected.");
    } finally { setSyncing(false); }
  }, [activeEmail, activeData.threads]);

  async function fetchByLabel(labelName: string) {
    if (!activeEmail) return;
    setLabelLoading(labelName);
    try {
      const token = await ensureToken();
      if (!token) throw new Error("Reconnect to load this label");
      const labels = activeData.labels.length ? activeData.labels : await listLabels(token);
      const results = await searchByLabel(token, activeEmail, labels, labelName);
      const others = (activeData.threads || []).filter((t) => !results.some((r) => r.id === t.id));
      persistAccountData(activeEmail, { threads: [...results, ...others], labels });
      showToast(`${results.length} thread${results.length === 1 ? "" : "s"} for "${labelName}"`);
    } catch (e: any) {
      showToast(e.message || `Couldn't load "${labelName}"`, "err");
    } finally { setLabelLoading(null); }
  }

  const threads = useMemo(() => {
    let list = activeData.threads || [];
    if (filter.kind === "stage") list = list.filter((t) => t.stage === filter.value);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter((t) => (t.subject + t.contactName + t.contactEmail).toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => b.lastActivity.localeCompare(a.lastActivity));
  }, [activeData.threads, filter, searchQ]);

  const stats = useMemo(() => {
    const list = activeData.threads || [];
    const open = list.filter((t) => OPEN_STAGES.includes(t.stage));
    return {
      open: open.length,
      attention: open.filter((t) => t.stage === "action_needed" || daysSince(t.lastActivity) > 14).length,
      interviews: list.filter((t) => t.stage === "interview" || t.stage === "screening").length,
      confirmed: list.filter((t) => t.stage === "confirmation" || t.stage === "bgv").length,
    };
  }, [activeData.threads]);

  const selected = (activeData.threads || []).find((t) => t.id === selectedId) || null;

  async function openThread(t: PipelineThread) {
    setSelectedId(t.id); setThreadOpen(true); setCompose("");
    if (!activeEmail || t.messages) return;
    try {
      const token = await ensureToken();
      if (!token) return;
      const messages = await getThreadMessages(token, t.id, activeEmail);
      persistAccountData(activeEmail, {
        threads: (activeData.threads || []).map((x) => (x.id === t.id ? { ...x, messages } : x)),
      });
    } catch (e: any) {
      showToast(e.message || "Couldn't load this thread's messages", "err");
    }
  }

  async function applyStage(thread: PipelineThread, newStage: string) {
    if (!activeEmail) return;
    persistAccountData(activeEmail, { threads: (activeData.threads || []).map((t) => (t.id === thread.id ? { ...t, stage: newStage as any } : t)) });
    showToast(`Status → ${STAGE_META[newStage]?.label}`);
    const labelName = STAGE_TO_LABEL[newStage];
    if (!labelName) return;
    setApplying(true);
    try {
      const token = await ensureToken();
      if (!token) throw new Error("Reconnect to write this label back to Gmail");
      const labels = activeData.labels.length ? activeData.labels : await listLabels(token);
      const label = await ensureLabel(token, labelName, labels);
      await modifyThreadLabels(token, thread.id, [label.id], []);
    } catch (e: any) {
      showToast(e.message || "Status saved locally, but Gmail wasn't updated", "err");
    } finally { setApplying(false); }
  }

  function pipelineSubject(thread: PipelineThread) { return `Re: ${thread.subject}`; }

  async function saveDraft(thread: PipelineThread) {
    if (!activeEmail || !thread.contactEmail) return;
    setDrafting(true);
    try {
      const token = await ensureToken();
      if (!token) throw new Error("Reconnect to save a Gmail draft");
      const body = compose.trim() || `Hi ${thread.contactName || "there"},\n\nFollowing up — any update on "${thread.subject}"?\n\nBest,\n${activeAccount?.name || ""}`;
      await createDraft(token, thread.contactEmail, pipelineSubject(thread), body);
      showToast(`Draft saved in ${activeEmail}`);
    } catch (e: any) {
      showToast(e.message || "Couldn't save the draft", "err");
    } finally { setDrafting(false); }
  }

  async function copyToClipboard(thread: PipelineThread) {
    const body = compose.trim() || "";
    const text = `To: ${thread.contactEmail}\nSubject: ${pipelineSubject(thread)}\n\n${body}`;
    try { await navigator.clipboard.writeText(text); showToast("Copied"); } catch { showToast("Clipboard blocked by the browser", "err"); }
  }

  function sendViaGmail(thread: PipelineThread) {
    if (!activeEmail) return;
    const body = compose.trim();
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(thread.contactEmail)}&su=${encodeURIComponent(pipelineSubject(thread))}&body=${encodeURIComponent(body)}&authuser=${encodeURIComponent(activeEmail)}`;
    window.open(url, "_blank");
  }

  const Pill = ({ c, children }: { c: string; children: any }) => (
    <span style={{ color: c, borderColor: c + "66", background: c + "1e", fontFamily: "'JetBrains Mono', monospace" }} className="text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap">{children}</span>
  );
  const StatCard = ({ label, value, c, active, onClick }: any) => (
    <button onClick={onClick} className="rounded-2xl p-3.5 flex flex-col gap-1.5 text-left transition-all active:scale-[0.97]"
      style={{ background: active ? col(c || "text") + "18" : T.card, border: `1.5px solid ${active ? col(c || "amber") : T.border}` }}>
      <span className="text-[10px] uppercase tracking-widest truncate" style={{ color: T.textDim }}>{label}</span>
      <span className="text-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif", color: c ? col(c) : T.text, fontWeight: 700 }}>{value}</span>
    </button>
  );

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text, fontFamily: "Inter, sans-serif" }}>
      <style>{`::-webkit-scrollbar{height:6px;width:6px}::-webkit-scrollbar-thumb{background:${T.borderLit};border-radius:3px}`}</style>

      {/* HEADER */}
      <div className="sticky top-0 z-30 border-b" style={{ borderColor: T.border, background: T.surface }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <Radio size={18} color={col("amber")} />
            <div className="min-w-0">
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }} className="text-base leading-none truncate">Pipeline Control</h1>
              <p className="text-[10px] truncate" style={{ color: T.textFaint }}>Switch between your connected Gmail accounts</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} className="p-2 rounded-lg" style={{ background: T.chip, border: `1px solid ${T.border}` }}>
              {theme === "dark" ? <Sun size={15} color={col("amber")} /> : <Moon size={15} color={col("violet")} />}
            </button>
            <button onClick={sync} disabled={syncing || !activeEmail} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold active:scale-95 disabled:opacity-40" style={{ background: col("amber"), color: theme === "dark" ? "#1A1305" : "#fff" }}>
              {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Sync
            </button>
          </div>
        </div>

        {/* ACCOUNT SWITCHER */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 pb-3 flex items-center gap-2 overflow-x-auto">
          {accounts.map((a) => {
            const active = a.email === activeEmail;
            const live = tokens[a.email] && tokens[a.email].expiresAt > Date.now();
            return (
              <div key={a.email} className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => switchAccount(a.email)} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: active ? col("amber") + "22" : T.chip, border: `1px solid ${active ? col("amber") + "66" : T.border}`, color: active ? col("amber") : T.textDim }}>
                  {a.picture ? <img src={a.picture} className="w-5 h-5 rounded-full" /> : <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px]" style={{ background: T.borderLit }}>{initials(a.name)}</span>}
                  <span className="truncate max-w-[140px]">{a.email}</span>
                  {!live && <KeyRound size={11} color={col("red")} />}
                </button>
                {active && (
                  <button onClick={() => removeAccount(a.email)} title="Disconnect this Gmail account" className="p-1"><LogOut size={13} color={T.textFaint} /></button>
                )}
              </div>
            );
          })}
          <button onClick={connectAccount} disabled={connecting} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 disabled:opacity-50" style={{ background: col("blue") + "1e", color: col("blue"), border: `1px solid ${col("blue")}55` }}>
            {connecting ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />} Add Gmail account
          </button>
        </div>
      </div>

      {!clientId && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 pt-3">
          <div className="rounded-xl px-3.5 py-2.5 text-xs sm:text-sm" style={{ background: col("amber") + "16", border: `1px solid ${col("amber")}44` }}>
            <b>Setup needed:</b> set <code>VITE_GOOGLE_CLIENT_ID</code> in a <code>.env.local</code> file (a Google Cloud OAuth Client ID with Gmail API enabled) before you can connect a real Gmail account. See <code>.env.example</code>.
          </div>
        </div>
      )}

      {errBanner && (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 pt-3">
          <div className="rounded-xl px-3.5 py-2.5 flex items-start justify-between gap-3 text-xs sm:text-sm" style={{ background: col("red") + "18", border: `1px solid ${col("red")}55` }}>
            <div className="flex items-start gap-2"><AlertTriangle size={15} color={col("red")} className="flex-shrink-0 mt-0.5" /><span>{errBanner}</span></div>
            <button onClick={() => setErrBanner(null)}><X size={14} /></button>
          </div>
        </div>
      )}

      {!activeEmail ? (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 py-16 text-center">
          <Mail size={28} color={T.textFaint} className="mx-auto mb-3" />
          <p className="text-sm" style={{ color: T.textDim }}>Connect a Gmail account to see its pipeline. Add more than one and switch between them anytime with the row above.</p>
        </div>
      ) : (
        <>
          {/* STAT CARDS */}
          <div className="max-w-[1200px] mx-auto px-4 sm:px-5 pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <StatCard label="Open pipeline" value={stats.open} active={filter.kind === "all"} onClick={() => setFilter({ kind: "all", value: null, label: "All threads" })} />
              <StatCard label="Needs a reply" value={stats.attention} c="amber" active={filter.kind === "stage" && filter.value === "action_needed"} onClick={() => setFilter({ kind: "stage", value: "action_needed", label: "Needs a reply" })} />
              <StatCard label="Screening + Interview" value={stats.interviews} c="green" active={false} onClick={() => setFilter({ kind: "stage", value: "interview", label: "Interview" })} />
              <StatCard label="Confirmed / BGV" value={stats.confirmed} c="blue" active={filter.kind === "stage" && filter.value === "confirmation"} onClick={() => setFilter({ kind: "stage", value: "confirmation", label: "Confirmed" })} />
            </div>
            {activeData.lastSync && <p className="text-[10px] mt-2" style={{ color: T.textFaint }}>Last synced {new Date(activeData.lastSync).toLocaleString()}</p>}
          </div>

          {/* GMAIL LABEL SHORTCUTS */}
          {activeData.labels.length > 0 && (
            <div className="max-w-[1200px] mx-auto px-4 sm:px-5 pt-3 flex gap-1.5 overflow-x-auto">
              {activeData.labels.slice(0, 8).map((l: GmailLabel) => (
                <button key={l.id} onClick={() => fetchByLabel(l.name)} disabled={labelLoading === l.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0 disabled:opacity-50" style={{ background: T.card, border: `1px solid ${T.border}`, color: T.textDim }}>
                  {labelLoading === l.name ? <Loader2 size={11} className="animate-spin" /> : null}{l.name}
                </button>
              ))}
            </div>
          )}

          {/* THREAD LIST */}
          <div className="max-w-[1200px] mx-auto px-4 sm:px-5 pt-4 pb-10">
            <div className="overflow-x-auto flex gap-1.5 pb-3">
              <button onClick={() => setFilter({ kind: "all", value: null, label: "All threads" })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0" style={{ background: filter.kind === "all" ? col("amber") + "22" : T.card, border: `1px solid ${T.border}`, color: filter.kind === "all" ? col("amber") : T.textDim }}><Inbox size={12} /> All</button>
              {Object.entries(STAGE_META).map(([k, v]) => (
                <button key={k} onClick={() => setFilter({ kind: "stage", value: k, label: v.label })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0" style={{ background: filter.kind === "stage" && filter.value === k ? col(v.color) + "22" : T.card, border: `1px solid ${T.border}`, color: filter.kind === "stage" && filter.value === k ? col(v.color) : T.textDim }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: col(v.color) }} />{v.label}
                </button>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.border}` }}>
              <div className="p-2.5 flex items-center gap-2" style={{ borderBottom: `1px solid ${T.border}` }}>
                <Search size={14} color={T.textFaint} />
                <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search subject or contact…" className="flex-1 bg-transparent outline-none text-sm" style={{ color: T.text }} />
              </div>
              {threads.length === 0 && <div className="p-6 text-center text-sm" style={{ color: T.textFaint }}>Nothing here yet — tap Sync, or add this Gmail account's job-related label above.</div>}
              {threads.map((t) => {
                const meta = STAGE_META[t.stage] || { label: t.stage, color: "textDim" };
                const d = daysSince(t.lastActivity);
                return (
                  <button key={t.id} onClick={() => openThread(t)} className="w-full text-left px-3.5 py-3 flex items-start gap-3 border-b" style={{ borderColor: T.border }}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{t.subject}</div>
                      <div className="text-xs truncate" style={{ color: T.textDim }}>{t.contactName} · {t.domain}</div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Pill c={col(meta.color)}>{meta.label}</Pill>
                        <span className="text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: d > 14 ? col("red") : T.textFaint }}>{d === 0 ? "today" : d + "d"}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} color={T.textFaint} className="flex-shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* THREAD DETAIL */}
      {threadOpen && selected && activeEmail && (
        <div className="fixed inset-0 z-40 flex flex-col" style={{ background: T.bg }}>
          <div className="flex-shrink-0 px-4 py-3 flex items-center gap-3" style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}>
            <button onClick={() => setThreadOpen(false)} className="flex items-center gap-1 text-sm -ml-1" style={{ color: T.textDim }}><ChevronLeft size={18} /> Back</button>
            <div className="flex-1 min-w-0 text-center">
              <div className="text-sm font-semibold truncate">{selected.subject}</div>
              <div className="text-[11px] truncate" style={{ color: T.textFaint }}>{selected.contactName} · as {activeEmail}</div>
            </div>
            <Pin size={17} color={T.textFaint} />
          </div>

          <div className="flex-shrink-0 px-4 py-2 flex items-center gap-2 flex-wrap" style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}>
            <span className="text-[10px]" style={{ color: T.textFaint }}>Status:</span>
            <select value={selected.stage} disabled={applying} onChange={(e) => applyStage(selected, e.target.value)} className="text-xs rounded-md px-2 py-1 outline-none" style={{ background: T.chip, color: col(STAGE_META[selected.stage]?.color), border: `1px solid ${T.border}` }}>
              {Object.entries(STAGE_META).map(([k, v]) => <option key={k} value={k} style={{ background: T.surface, color: T.text }}>{v.label}</option>)}
            </select>
            {applying && <Loader2 size={12} className="animate-spin" color={T.textFaint} />}
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ minHeight: 0 }}>
            {selected.messages === undefined && <div className="text-center py-6"><Loader2 size={18} className="animate-spin mx-auto" color={T.textFaint} /></div>}
            {(selected.messages || []).map((m) => (
              <div key={m.id} className={`flex ${m.self ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%]">
                  {!m.self && <div className="text-[10px] mb-1" style={{ color: T.textFaint }}>{m.from}</div>}
                  <div className="rounded-2xl px-3.5 py-2.5 text-sm leading-snug whitespace-pre-wrap" style={{ background: m.self ? col("amber") + "26" : T.card, border: `1px solid ${m.self ? col("amber") + "44" : T.border}` }}>{m.body}</div>
                  <div className="text-[9px] mt-1" style={{ color: T.textFaint, textAlign: m.self ? "right" : "left", fontFamily: "'JetBrains Mono', monospace" }}>{fmtDate(m.date.slice(0, 10))}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-shrink-0 p-3 flex flex-col gap-2" style={{ background: T.surface, borderTop: `1px solid ${T.border}` }}>
            <div className="flex items-end gap-2">
              <textarea value={compose} onChange={(e) => setCompose(e.target.value)} placeholder="Type your reply…" className="flex-1 text-sm rounded-xl p-3 outline-none resize-none" rows={2} style={{ background: T.card, border: `1px solid ${T.border}`, color: T.text }} />
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button onClick={() => copyToClipboard(selected)} className="flex items-center justify-center gap-1 text-xs py-2.5 rounded-lg font-medium" style={{ background: T.chip, color: T.textDim, border: `1px solid ${T.border}` }}><Copy size={13} /> Copy</button>
              <button onClick={() => saveDraft(selected)} disabled={drafting} className="flex items-center justify-center gap-1 text-xs py-2.5 rounded-lg font-medium disabled:opacity-40" style={{ background: col("blue") + "22", color: col("blue"), border: `1px solid ${col("blue")}55` }}>{drafting ? <Loader2 size={12} className="animate-spin" /> : <Mail size={13} />} Save draft</button>
              <button onClick={() => sendViaGmail(selected)} className="flex items-center justify-center gap-1 text-xs py-2.5 rounded-lg font-semibold" style={{ background: col("green"), color: theme === "dark" ? "#08130C" : "#fff" }}><Send size={13} /> Send as {activeEmail?.split("@")[0]}</button>
            </div>
            <p className="text-[10px] text-center leading-relaxed" style={{ color: T.textFaint }}>Send opens Gmail's web compose pinned to this connected account via <code>authuser</code>, prefilled — you tap send there.</p>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-xl" style={{ background: toast.tone === "err" ? col("red") : T.card, border: `1px solid ${toast.tone === "err" ? col("red") : T.borderLit}`, color: T.text }}>
          {toast.tone === "err" ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} color={col("green")} />}{toast.msg}
        </div>
      )}
    </div>
  );
}
