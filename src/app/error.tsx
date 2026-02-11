"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <section className="ar-section min-h-screen">
      <div className="ar-section__inner flex items-center justify-center min-h-[60vh]">
        <div className="ar-fade-in">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                An unexpected error occurred. Please try again.
              </p>
              {process.env.NODE_ENV === "development" && (
                <pre className="text-xs bg-secondary p-3 rounded overflow-auto max-h-48">
                  {error.message}
                </pre>
              )}
              <Button onClick={reset} className="w-full">
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
