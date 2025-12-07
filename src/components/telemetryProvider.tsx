"use client";

import TelemetryDeck from "@telemetrydeck/sdk";
import { useEffect } from "react";

function getOrCreateClientUser(): string {
  if (typeof window === "undefined") {
    return "anonymous";
  }

  const STORAGE_KEY = "telemetrydeck_client_user";
  let clientUser = localStorage.getItem(STORAGE_KEY);

  if (!clientUser) {
    // Generate a simple UUID-like identifier
    clientUser = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(STORAGE_KEY, clientUser);
  }

  return clientUser;
}

let telemetryDeckInstance: TelemetryDeck | null = null;

export function getTelemetryDeck(): TelemetryDeck | null {
  return telemetryDeckInstance;
}

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check for NEXT_PUBLIC_ prefix (required for Next.js client-side env vars)
    const appId = process.env.NEXT_PUBLIC_TELEMETRY_DECK_APP_ID;

    if (!appId) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "TELEMETRY_DECK_APP_ID is not set. Set NEXT_PUBLIC_TELEMETRY_DECK_APP_ID in your .env file."
        );
      }
      return;
    }

    const clientUser = getOrCreateClientUser();

    // Initialize Telemetry Deck singleton
    // Note: orgNamespace "ac.richter" should be configured in your Telemetry Deck dashboard
    // or may be part of your app ID format
    telemetryDeckInstance = new TelemetryDeck({
      appID: appId,
      clientUser: clientUser,
    });

    // Send an initial signal to indicate the app has loaded
    telemetryDeckInstance
      .signal("appLaunch", {
        orgNamespace: "ac.richter",
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to send Telemetry Deck signal:", error);
        }
      });
  }, []);

  return <>{children}</>;
}

