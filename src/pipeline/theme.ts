import type { Stage } from "./types";

export const THEMES = {
  dark: {
    name: "dark",
    bg: "#0E1017", surface: "#171B24", card: "#1C2230", cardHover: "#232B3C",
    border: "#2C3547", borderLit: "#3D4a63",
    text: "#F2F0EA", textDim: "#98A2B6", textFaint: "#5E6980",
    amber: "#FFB13D", blue: "#5CB4FF", red: "#FF6B74", green: "#4FD98A", violet: "#B18CFF",
    chip: "#20283A",
  },
  light: {
    name: "light",
    bg: "#F4F6FB", surface: "#FFFFFF", card: "#FFFFFF", cardHover: "#F0F3FA",
    border: "#E2E7F0", borderLit: "#CDD5E4",
    text: "#17202E", textDim: "#5A6579", textFaint: "#939DB0",
    amber: "#E5820A", blue: "#1E80D6", red: "#E23744", green: "#149A5B", violet: "#7A4FE0",
    chip: "#EEF2F9",
  },
} as const;

export type ThemeName = keyof typeof THEMES;
export type Theme = typeof THEMES.dark;

export const STAGE_META: Record<string, { label: string; color: string }> = {
  action_needed: { label: "Needs a reply", color: "amber" },
  engaged: { label: "In conversation", color: "blue" },
  screening: { label: "Screening", color: "violet" },
  interview: { label: "Interview", color: "green" },
  confirmation: { label: "Rate / RTR confirmed", color: "blue" },
  bgv: { label: "Background check", color: "violet" },
  closed: { label: "Closed", color: "textFaint" },
};

export const OPEN_STAGES = ["action_needed", "engaged", "screening", "interview", "confirmation", "bgv"];

// priority order: first matching real Gmail label wins the thread's stage
export const LABEL_STAGE_PRIORITY: Array<{ label: string; stage: Stage }> = [
  { label: "Unwanted", stage: "closed" },
  { label: "Confirmation", stage: "confirmation" },
  { label: "Interview", stage: "interview" },
  { label: "Screening", stage: "screening" },
  { label: "BGV", stage: "bgv" },
  { label: "FollowUP", stage: "engaged" },
  { label: "Submitions", stage: "engaged" },
  { label: "Recruiter Referral", stage: "engaged" },
];

export const SYNC_LABEL_NAMES = ["FollowUP", "Submitions", "Screening", "Interview", "Confirmation", "BGV", "Recruiter Referral"];

// which Gmail label a manual stage change should write back to the thread
export const STAGE_TO_LABEL: Record<string, string> = {
  engaged: "FollowUP",
  screening: "Screening",
  interview: "Interview",
  confirmation: "Confirmation",
  bgv: "BGV",
  closed: "Unwanted",
};
