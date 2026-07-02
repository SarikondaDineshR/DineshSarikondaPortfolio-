export type Stage =
  | "action_needed"
  | "engaged"
  | "screening"
  | "interview"
  | "confirmation"
  | "bgv"
  | "closed";

export interface GmailAccount {
  email: string;
  name: string;
  picture: string;
}

export interface GmailLabel {
  id: string;
  name: string;
  type?: string;
}

export interface ThreadMessage {
  id: string;
  from: string;
  email: string;
  date: string; // ISO
  body: string;
  self: boolean;
}

export interface PipelineThread {
  id: string; // gmail thread id
  subject: string;
  snippet: string;
  contactName: string;
  contactEmail: string;
  domain: string;
  stage: Stage;
  labelIds: string[];
  lastActivity: string; // YYYY-MM-DD
  pinned: boolean;
  messages?: ThreadMessage[];
}

export interface AccountData {
  labels: GmailLabel[];
  threads: PipelineThread[];
  notes: Record<string, string>;
  lastSync: string | null;
}

export interface StoredToken {
  token: string;
  expiresAt: number;
}
