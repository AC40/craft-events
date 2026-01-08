"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  getCurrentTimezone,
  setTestTimezone,
  getTestTimezone,
  TEST_TIMEZONES,
} from "@/lib/timezoneUtils";

/**
 * Dev tool component for testing timezone functionality
 * Only shows in development mode
 */
export default function TimezoneTester() {
  const [currentTz, setCurrentTz] = useState<string>("");
  const [testTz, setTestTz] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTz(getCurrentTimezone());
    setTestTz(getTestTimezone());
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const handleSetTimezone = (tz: string | null) => {
    setTestTimezone(tz);
    setTestTz(tz);
    setCurrentTz(getCurrentTimezone());
    // Reload to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <Card className="mb-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <CardHeader>
        <CardTitle className="text-sm">🧪 Timezone Tester (Dev Only)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs">
          <p className="font-semibold">Current Timezone:</p>
          <p className="font-mono">{currentTz}</p>
          {testTz && (
            <p className="mt-1 text-yellow-700 dark:text-yellow-300">
              (Overridden from: {testTz})
            </p>
          )}
        </div>

        <div className="text-xs">
          <p className="mb-2 font-semibold">Quick Test:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(TEST_TIMEZONES).map(([label, tz]) => (
              <Button
                key={tz}
                variant={testTz === tz ? "default" : "outline"}
                size="sm"
                onClick={() => handleSetTimezone(tz)}
                className="text-xs"
              >
                {label}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSetTimezone(null)}
              className="text-xs"
            >
              Clear (Use Real)
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p className="font-semibold">Tip:</p>
          <p>
            You can also use query parameter:{" "}
            <code className="bg-secondary px-1 py-0.5 rounded">
              ?tz=America/New_York
            </code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
