import type { CraftConnection } from "@/types/connection";

const CONNECTIONS_KEY = "craft_connections";
const ACTIVE_CONNECTION_KEY = "craft_active_connection";

export function loadConnections(): CraftConnection[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CONNECTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConnections(connections: CraftConnection[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
}

export function loadActiveConnectionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACTIVE_CONNECTION_KEY);
  } catch {
    return null;
  }
}

export function saveActiveConnectionId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id === null) {
    localStorage.removeItem(ACTIVE_CONNECTION_KEY);
  } else {
    localStorage.setItem(ACTIVE_CONNECTION_KEY, id);
  }
}
