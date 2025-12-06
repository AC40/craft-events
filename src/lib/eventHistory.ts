"use client";

export interface EventHistoryEntry {
  blockId: string;
  title: string;
  documentTitle?: string;
  blob: string;
  voteUrl: string;
  resultsUrl: string;
  createdAt: number;
}

const HISTORY_COOKIE_NAME = "craft_event_history";
const HISTORY_LIMIT = 8;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  return match.slice(name.length + 1);
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${value};path=/;max-age=${COOKIE_MAX_AGE};sameSite=Lax`;
}

export function loadEventHistory(): EventHistoryEntry[] {
  if (typeof document === "undefined") {
    return [];
  }

  const cookieValue = readCookie(HISTORY_COOKIE_NAME);
  if (!cookieValue) {
    return [];
  }

  try {
    return JSON.parse(decodeURIComponent(cookieValue)) as EventHistoryEntry[];
  } catch (error) {
    console.error("Failed to parse event history cookie", error);
    return [];
  }
}

export function addEventToHistory(
  entry: EventHistoryEntry
): EventHistoryEntry[] {
  const existing = loadEventHistory();
  const filtered = existing.filter((item) => item.blockId !== entry.blockId);
  const updated = [entry, ...filtered].slice(0, HISTORY_LIMIT);
  writeCookie(HISTORY_COOKIE_NAME, encodeURIComponent(JSON.stringify(updated)));
  return updated;
}

