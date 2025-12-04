"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ResultsView from "@/components/resultsView";
import { useEventTable } from "@/lib/useEventTable";
import { addEventToHistory } from "@/lib/eventHistory";

export default function EventResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const blockId = params?.blockId as string;
  const encryptedBlob = searchParams.get("blob");
  const eventTitle = searchParams.get("title") || "Event scheduling";

  const {
    data: block,
    isLoading,
    error,
    table,
    timeSlots,
    markdown,
  } = useEventTable(blockId, encryptedBlob);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground mb-4">
                No table data found
              </p>
              {markdown && (
                <div className="text-xs text-muted-foreground">
                  <p className="mb-2">Markdown found:</p>
                  <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96 overflow-y-auto">
                    {markdown}
                  </pre>
                </div>
              )}
              {!markdown && (
                <div className="text-xs text-muted-foreground">
                  <p>Block structure:</p>
                  <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96 overflow-y-auto">
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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground mb-4">
                No time slots found in table
              </p>
              <div className="text-xs text-muted-foreground">
                <p className="mb-2">Table headers:</p>
                <pre className="bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(table.headers, null, 2)}
                </pre>
                <p className="mb-2 mt-4">Table rows:</p>
                <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96 overflow-y-auto">
                  {JSON.stringify(table.rows, null, 2)}
                </pre>
                {markdown && (
                  <>
                    <p className="mb-2 mt-4">Raw markdown:</p>
                    <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96 overflow-y-auto">
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Event results</p>
          <h1 className="text-3xl font-semibold text-gray-900">{eventTitle}</h1>
        </div>

        <ResultsView table={table} timeSlots={timeSlots} />

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
