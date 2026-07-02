import type { AccountData, GmailAccount } from "./types";

const ACCOUNTS_KEY = "pipeline:accounts";
const ACTIVE_KEY = "pipeline:active";
const dataKey = (email: string) => `pipeline:data:${email}`;

export function loadAccounts(): GmailAccount[] {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveAccounts(accounts: GmailAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function loadActiveEmail(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function saveActiveEmail(email: string | null) {
  if (email) localStorage.setItem(ACTIVE_KEY, email);
  else localStorage.removeItem(ACTIVE_KEY);
}

export function loadAccountData(email: string): AccountData {
  try {
    const raw = localStorage.getItem(dataKey(email));
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupted cache */
  }
  return { labels: [], threads: [], notes: {}, lastSync: null };
}

export function saveAccountData(email: string, data: AccountData) {
  localStorage.setItem(dataKey(email), JSON.stringify(data));
}

export function removeAccountData(email: string) {
  localStorage.removeItem(dataKey(email));
}
