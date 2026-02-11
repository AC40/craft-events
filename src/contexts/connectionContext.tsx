"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { CraftConnection, CraftConnectionType } from "@/types/connection";
import {
  loadConnections,
  saveConnections,
  loadActiveConnectionId,
  saveActiveConnectionId,
} from "@/lib/connectionStore";

interface ConnectionContextValue {
  connections: CraftConnection[];
  activeConnection: CraftConnection | null;
  addConnection: (data: {
    name: string;
    url: string;
    type: CraftConnectionType;
    encryptedBlob: string;
  }) => CraftConnection;
  updateConnection: (id: string, updates: Partial<CraftConnection>) => void;
  deleteConnection: (id: string) => void;
  setActiveConnection: (id: string | null) => void;
  rememberDocument: (
    connectionId: string,
    docId: string,
    docTitle: string
  ) => void;
}

const ConnectionContext = createContext<ConnectionContextValue | null>(null);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [connections, setConnections] = useState<CraftConnection[]>(
    () => loadConnections()
  );
  const [activeId, setActiveId] = useState<string | null>(
    () => loadActiveConnectionId()
  );

  const activeConnection =
    connections.find((c) => c.id === activeId) ?? null;

  const addConnection = useCallback(
    (data: {
      name: string;
      url: string;
      type: CraftConnectionType;
      encryptedBlob: string;
    }): CraftConnection => {
      const now = Date.now();
      const connection: CraftConnection = {
        id: crypto.randomUUID(),
        name: data.name,
        url: data.url,
        type: data.type,
        encryptedBlob: data.encryptedBlob,
        createdAt: now,
        updatedAt: now,
      };
      setConnections((prev) => {
        const next = [...prev, connection];
        saveConnections(next);
        return next;
      });
      return connection;
    },
    []
  );

  const updateConnection = useCallback(
    (id: string, updates: Partial<CraftConnection>) => {
      setConnections((prev) => {
        const next = prev.map((c) =>
          c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
        );
        saveConnections(next);
        return next;
      });
    },
    []
  );

  const deleteConnection = useCallback(
    (id: string) => {
      setConnections((prev) => {
        const next = prev.filter((c) => c.id !== id);
        saveConnections(next);
        return next;
      });
      setActiveId((prev) => {
        if (prev === id) {
          saveActiveConnectionId(null);
          return null;
        }
        return prev;
      });
    },
    []
  );

  const setActiveConnection = useCallback((id: string | null) => {
    setActiveId(id);
    saveActiveConnectionId(id);
  }, []);

  const rememberDocument = useCallback(
    (connectionId: string, docId: string, docTitle: string) => {
      setConnections((prev) => {
        const next = prev.map((c) =>
          c.id === connectionId
            ? {
                ...c,
                lastDocumentId: docId,
                lastDocumentTitle: docTitle,
                updatedAt: Date.now(),
              }
            : c
        );
        saveConnections(next);
        return next;
      });
    },
    []
  );

  return (
    <ConnectionContext.Provider
      value={{
        connections,
        activeConnection,
        addConnection,
        updateConnection,
        deleteConnection,
        setActiveConnection,
        rememberDocument,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnections(): ConnectionContextValue {
  const ctx = useContext(ConnectionContext);
  if (!ctx) {
    throw new Error("useConnections must be used within a ConnectionProvider");
  }
  return ctx;
}
