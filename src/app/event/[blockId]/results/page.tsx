"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ResultsView from "@/components/resultsView";
import { useEventTable } from "@/lib/useEventTable";
import { addEventToHistory } from "@/lib/eventHistory";
import { toast } from "sonner";

export default function EventResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const blockId = params?.blockId as string;
  const encryptedBlob = searchParams?.get("blob") || undefined;
  const eventTitle = searchParams?.get("title") || "Event scheduling";

  const {
    data: block,
    isLoading,
    error,
    table,
    timeSlots,
    markdown,
    timezone,
  } = useEventTable(blockId, encryptedBlob);
  const isOrganiser = table?.rows.some(
    (row) => row.cells[0]?.value.trim().toLowerCase() === "organiser"
  );

  const voteUrl =
    blockId && encryptedBlob
      ? `${
          typeof window !== "undefined" ? window.location.origin : ""
        }/event/${blockId}?blob=${encodeURIComponent(
          encryptedBlob
        )}&title=${encodeURIComponent(eventTitle)}`
      : "";

  useEffect(() => {
    if (!blockId || !encryptedBlob || !table) {
      return;
    }

    const encodedTitle = encodeURIComponent(eventTitle);
    const voteUrl = `/event/${blockId}?blob=${encodeURIComponent(
      encryptedBlob
    )}&title=${encodedTitle}`;
    const resultsUrl = `/event/${blockId}/results?blob=${encodeURIComponent(
      encryptedBlob
    )}&title=${encodedTitle}`;

    addEventToHistory({
      blockId,
      title: eventTitle,
      blob: encryptedBlob,
      voteUrl,
      resultsUrl,
      createdAt: Date.now(),
    });
  }, [blockId, encryptedBlob, eventTitle, table]);

  useEffect(() => {
    if (!isOrganiser || !voteUrl || !blockId) {
      return;
    }

    // Only copy on initial visit after creation (when justCreated query param is present)
    const justCreated = searchParams?.get("justCreated") === "true";
    
    if (justCreated) {
      navigator.clipboard.writeText(voteUrl).then(() => {
        toast.success("Voting link copied to clipboard!", {
          description:
            "Share this link with participants to collect their availability.",
        });
        // Remove the query parameter from URL without reloading
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("justCreated");
        window.history.replaceState({}, "", newUrl.toString());
      });
    }
  }, [isOrganiser, voteUrl, blockId, searchParams]);

  const handleCopyLink = async () => {
    if (!voteUrl) return;
    try {
      await navigator.clipboard.writeText(voteUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-background">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Loading results...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !block) {
    return (
      <div className="p-8 min-h-screen bg-background">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-6">
              <div className="p-3 text-sm rounded border text-destructive-foreground bg-destructive/90 border-destructive/50">
                {error instanceof Error
                  ? error.message
                  : "Failed to load results"}
              </div>
              {block && (
                <div className="mt-4 text-xs text-muted-foreground">
                  <pre>{JSON.stringify(block, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="p-8 min-h-screen bg-background">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-6">
              <p className="mb-4 text-center text-muted-foreground">
                No table data found
              </p>
              {markdown && (
                <div className="text-xs text-muted-foreground">
                  <p className="mb-2">Markdown found:</p>
                  <pre className="overflow-auto overflow-y-auto p-2 max-h-96 rounded bg-secondary">
                    {markdown}
                  </pre>
                </div>
              )}
              {!markdown && (
                <div className="text-xs text-muted-foreground">
                  <p>Block structure:</p>
                  <pre className="overflow-auto overflow-y-auto p-2 max-h-96 rounded bg-secondary">
                    {JSON.stringify(block, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="p-8 min-h-screen bg-background">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-6">
              <p className="mb-4 text-center text-muted-foreground">
                No time slots found in table
              </p>
              <div className="text-xs text-muted-foreground">
                <p className="mb-2">Table headers:</p>
                <pre className="overflow-auto p-2 rounded bg-secondary">
                  {JSON.stringify(table.headers, null, 2)}
                </pre>
                <p className="mt-4 mb-2">Table rows:</p>
                <pre className="overflow-auto overflow-y-auto p-2 max-h-96 rounded bg-secondary">
                  {JSON.stringify(table.rows, null, 2)}
                </pre>
                {markdown && (
                  <>
                    <p className="mt-4 mb-2">Raw markdown:</p>
                    <pre className="overflow-auto overflow-y-auto p-2 max-h-96 rounded bg-secondary">
                      {markdown}
                    </pre>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-background">
      <div className="mx-auto space-y-6 max-w-6xl">
        <div className="space-y-1">
          <div className="mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← Back to home
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">Event results</p>
          <h1 className="text-3xl font-semibold text-foreground">
            {eventTitle}
          </h1>
        </div>

        <ResultsView table={table} timeSlots={timeSlots} timezone={timezone} />

        {isOrganiser && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Share with participants
                </h3>
                <p className="text-sm text-muted-foreground">
                  This event was created in Craft. Share the voting link below
                  so participants can mark their availability.
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex-1 p-3 font-mono text-sm break-all rounded border bg-secondary border-border">
                  {voteUrl}
                </div>
                <Button onClick={handleCopyLink} variant="outline">
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="space-y-3">
            <p className="mt-4 text-sm text-muted-foreground">
              Need to update your availability? Head to the voting view.
            </p>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/event/${blockId}?blob=${encodeURIComponent(
                    encryptedBlob || ""
                  )}&title=${encodeURIComponent(eventTitle)}`
                )
              }
            >
              Vote again
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
