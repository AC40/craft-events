/**
 * Utility functions for timezone handling, including test overrides
 */

/**
 * Gets the current timezone, with support for testing overrides
 * Checks in order:
 * 1. Query parameter ?tz= (for testing)
 * 2. localStorage key 'craft-events-test-timezone' (for testing)
 * 3. Actual browser timezone
 */
export function getCurrentTimezone(): string {
  // Check query parameter first (easiest for quick testing)
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const tzParam = urlParams.get("tz");
    if (tzParam) {
      console.log(
        "[timezoneUtils] Using timezone from query parameter:",
        tzParam
      );
      return tzParam;
    }

    // Check localStorage (for persistent testing)
    const storedTz = localStorage.getItem("craft-events-test-timezone");
    if (storedTz) {
      console.log(
        "[timezoneUtils] Using timezone from localStorage:",
        storedTz
      );
      return storedTz;
    }
  }

  // Default to actual browser timezone
  const actualTz =
    typeof window !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC";
  return actualTz;
}

/**
 * Sets a test timezone override in localStorage
 * @param timezone - IANA timezone string (e.g., "America/New_York") or null to clear
 */
export function setTestTimezone(timezone: string | null): void {
  if (typeof window === "undefined") return;

  if (timezone) {
    localStorage.setItem("craft-events-test-timezone", timezone);
    console.log("[timezoneUtils] Test timezone set to:", timezone);
    console.log("[timezoneUtils] Reload the page to apply the change");
  } else {
    localStorage.removeItem("craft-events-test-timezone");
    console.log("[timezoneUtils] Test timezone cleared");
    console.log("[timezoneUtils] Reload the page to apply the change");
  }
}

/**
 * Gets the test timezone override if set
 */
export function getTestTimezone(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("craft-events-test-timezone");
}

/**
 * Common timezones for testing
 */
export const TEST_TIMEZONES = {
  "New York (EST/EDT)": "America/New_York",
  "Los Angeles (PST/PDT)": "America/Los_Angeles",
  "London (GMT/BST)": "Europe/London",
  "Berlin (CET/CEST)": "Europe/Berlin",
  "Tokyo (JST)": "Asia/Tokyo",
  "Sydney (AEDT/AEST)": "Australia/Sydney",
  UTC: "UTC",
} as const;
