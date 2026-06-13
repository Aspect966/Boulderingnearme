import type { GradeScale } from "@/lib/grades";

export const BOULDER_FORM_DRAFT_COOKIE = "boulder-form-draft";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type BoulderFormDraft = {
  name: string;
  locationLabel: string;
  description: string;
  scale: GradeScale;
  initialGrade: string;
  lat: string;
  lng: string;
};

function encodeCookieValue(value: string) {
  return encodeURIComponent(value);
}

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function readBoulderFormDraft(): BoulderFormDraft | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${BOULDER_FORM_DRAFT_COOKIE}=([^;]*)`)
  );
  if (!match) return null;

  try {
    return JSON.parse(decodeCookieValue(match[1])) as BoulderFormDraft;
  } catch {
    return null;
  }
}

export function writeBoulderFormDraft(draft: BoulderFormDraft) {
  if (typeof document === "undefined") return;

  const value = encodeCookieValue(JSON.stringify(draft));
  document.cookie = `${BOULDER_FORM_DRAFT_COOKIE}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearBoulderFormDraft() {
  if (typeof document === "undefined") return;

  document.cookie = `${BOULDER_FORM_DRAFT_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
