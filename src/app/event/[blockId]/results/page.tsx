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
  } = useEventTable(blockId, encryptedBlob);
  const [hasCopied, setHasCopied] = useState(false);

  const isOrganiser = table?.rows.some(
    (row) => row.cells[0]?.value.trim().toLowerCase() === "organiser"
  );

  const voteUrl = blockId && encryptedBlob
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/event/${blockId}?blob=${encodeURIComponent(encryptedBlob)}&title=${encodeURIComponent(eventTitle)}`
    : "";

  useEffect(() => {
    if (!blockId || !encryptedBlob || !table) {
      return;
    }

    const encodedTitle = encodeURIComponent(eventTitle);
    const voteUrl = `/event/${blockId}?blob=${encodeURIComponent(encryptedBlob)}&title=${encodedTitle}`;
    const resultsUrl = `/event/${blockId}/results?blob=${encodeURIComponent(encryptedBlob)}&title=${encodedTitle}`;

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
    if (isOrganiser && voteUrl && !hasCopied) {
      navigator.clipboard.writeText(voteUrl).then(() => {
        setHasCopied(true);
        toast.success("Voting link copied to clipboard!", {
          description: "Share this link with participants to collect their availability.",
        });
      });
    }
  }, [isOrganiser, voteUrl, hasCopied]);

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
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
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
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-destructive-foreground bg-destructive/90 p-3 rounded border border-destructive/50">
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
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground mb-4">
                No table data found
              </p>
              {markdown && (
                <div className="text-xs text-muted-foreground">
                  <p className="mb-2">Markdown found:</p>
                  <pre className="bg-secondary p-2 rounded overflow-auto max-h-96 overflow-y-auto">
                    {markdown}
                  </pre>
                </div>
              )}
              {!markdown && (
                <div className="text-xs text-muted-foreground">
                  <p>Block structure:</p>
                  <pre className="bg-secondary p-2 rounded overflow-auto max-h-96 overflow-y-auto">
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
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground mb-4">
                No time slots found in table
              </p>
              <div className="text-xs text-muted-foreground">
                <p className="mb-2">Table headers:</p>
                <pre className="bg-secondary p-2 rounded overflow-auto">
                  {JSON.stringify(table.headers, null, 2)}
                </pre>
                <p className="mb-2 mt-4">Table rows:</p>
                <pre className="bg-secondary p-2 rounded overflow-auto max-h-96 overflow-y-auto">
                  {JSON.stringify(table.rows, null, 2)}
                </pre>
                {markdown && (
                  <>
                    <p className="mb-2 mt-4">Raw markdown:</p>
                    <pre className="bg-secondary p-2 rounded overflow-auto max-h-96 overflow-y-auto">
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
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-1">
          <div className="mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← Back to home
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">Event results</p>
          <h1 className="text-3xl font-semibold text-foreground">{eventTitle}</h1>
        </div>

        <ResultsView table={table} timeSlots={timeSlots} />

        {isOrganiser && (
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Share with participants
                </h3>
                <p className="text-sm text-muted-foreground">
                  This event was created in Craft. Share the voting link below so
                  participants can mark their availability.
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex-1 p-3 bg-secondary rounded border border-border text-sm font-mono break-all">
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
            <p className="text-sm text-muted-foreground">
              Need to update your availability? Head to the voting view.
            </p>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/event/${blockId}?blob=${encodeURIComponent(encryptedBlob || "")}&title=${encodeURIComponent(
                    eventTitle
                  )}`
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
