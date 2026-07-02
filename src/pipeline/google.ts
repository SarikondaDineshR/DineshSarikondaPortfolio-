// Client-side Google OAuth via Google Identity Services (GIS).
// No backend involved: the access token lives only in memory for this tab.
// Docs: https://developers.google.com/identity/oauth2/web/guides/use-token-model

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (resp: TokenResponse) => void;
            error_callback?: (err: { type: string; message?: string }) => void;
          }) => { requestAccessToken: (opts?: { prompt?: string; hint?: string }) => void };
        };
      };
    };
  }
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  error?: string;
}

export const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
].join(" ");

let scriptPromise: Promise<void> | null = null;

export function loadGis(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Couldn't load Google's sign-in script"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function getClientId(): string | undefined {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
}

/** Requests an access token, optionally silently (no popup) or scoped to a hinted email. */
export async function requestAccessToken(opts: { interactive: boolean; hint?: string }): Promise<TokenResponse> {
  const clientId = getClientId();
  if (!clientId) throw new Error("VITE_GOOGLE_CLIENT_ID isn't configured");
  await loadGis();
  return new Promise((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GMAIL_SCOPES,
      callback: (resp) => {
        if (resp.error) reject(new Error(resp.error));
        else resolve(resp);
      },
      error_callback: (err) => reject(new Error(err.message || err.type || "Sign-in was cancelled")),
    });
    client.requestAccessToken({ prompt: opts.interactive ? "consent" : "", hint: opts.hint });
  });
}

export async function fetchUserInfo(token: string): Promise<{ email: string; name: string; picture: string }> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Couldn't read the connected account's profile");
  const data = await res.json();
  return { email: data.email, name: data.name || data.email, picture: data.picture || "" };
}
