"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import UrlForm from "@/components/urlForm";
import DocumentSelector from "@/components/documentSelector";
import EventForm from "@/components/eventForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { encryptSecrets, createBlocks } from "@/app/actions";
import {
  addEventToHistory,
  loadEventHistory,
  type EventHistoryEntry,
} from "@/lib/eventHistory";
import type { CraftDocument } from "@/lib/craftApi";
import type { EventFormData } from "@/components/eventForm";

export default function Home() {
  const router = useRouter();
  const [encryptedBlob, setEncryptedBlob] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] =
    useState<CraftDocument | null>(null);
  const [isInserting, setIsInserting] = useState(false);
  const [insertError, setInsertError] = useState<string | null>(null);
  const [eventHistory, setEventHistory] = useState<EventHistoryEntry[]>([]);
  const [historyVisible, setHistoryVisible] = useState(true);

  useEffect(() => {
    setEventHistory(loadEventHistory());
  }, []);

  const handleUrlSubmit = async (url: string, key?: string) => {
    try {
      const blob = await encryptSecrets({ apiUrl: url, apiKey: key });
      setEncryptedBlob(blob);
      setSelectedDocument(null);
      setInsertError(null);
    } catch (error) {
      setInsertError(
        error instanceof Error ? error.message : "Failed to encrypt credentials"
      );
    }
  };

  const handleDocumentSelect = async (document: CraftDocument) => {
    setSelectedDocument(document);
    setInsertError(null);
  };

  const createEventMutation = useMutation({
    mutationFn: async ({
      documentId,
      eventTitle,
      description,
      location,
      timeSlots,
      blob,
      baseUrl,
    }: {
      documentId: string;
      eventTitle: string;
      description: string;
      location: string;
      timeSlots: Array<{ date: Date; hour: number }>;
      blob: string;
      baseUrl: string;
    }) => {
      if (!blob) throw new Error("Encrypted blob not set");

      const { formatTableHeader } = await import("@/lib/tableParser");

      const pageTitle = `${eventTitle} – Scheduling`;
      const pageBlock = {
        type: "text",
        textStyle: "page",
        markdown: pageTitle,
      };

      const pageResponse = await createBlocks(blob, documentId, [pageBlock]);
      const pageId = pageResponse.items[0]?.id;

      if (!pageId) {
        throw new Error("Failed to get page ID after creation");
      }

      const blocks: Array<{
        type: string;
        markdown?: string;
        textStyle?: string;
      }> = [];

      if (description) {
        blocks.push({
          type: "text",
          markdown: description,
        });
      }

      if (location) {
        blocks.push({
          type: "text",
          markdown: location,
        });
      }

      if (blocks.length > 0) {
        await createBlocks(blob, pageId, blocks);
      }

      const separatorBlock = {
        type: "text",
        markdown: "---",
      };

      await createBlocks(blob, pageId, [separatorBlock]);

      const tableHeaders = [
        "Name",
        ...timeSlots.map((slot) => formatTableHeader(slot.date, slot.hour)),
      ];
      const tableSeparator = ["---", ...timeSlots.map(() => "---")];
      const organiserRow = ["Organiser", ...timeSlots.map(() => "✅")];

      const tableMarkdown = [
        `| ${tableHeaders.join(" | ")} |`,
        `| ${tableSeparator.join(" | ")} |`,
        `| ${organiserRow.join(" | ")} |`,
      ].join("\n");

      const tableBlock = {
        type: "text",
        markdown: tableMarkdown,
      };

      const tableResponse = await createBlocks(blob, pageId, [tableBlock]);
      const tableBlockId = tableResponse.items[0]?.id;

      if (!tableBlockId) {
        throw new Error("Failed to get table block ID after creation");
      }

      const encodedTitle = encodeURIComponent(eventTitle);
      const voteUrl = `${baseUrl}/event/${tableBlockId}?blob=${encodeURIComponent(
        blob
      )}&title=${encodedTitle}`;
      const resultsUrl = `${baseUrl}/event/${tableBlockId}/results?blob=${encodeURIComponent(
        blob
      )}&title=${encodedTitle}`;
      const linkBlock = {
        type: "text",
        markdown: `[Vote on availability →](${voteUrl})\n\n[View live results →](${resultsUrl})`,
      };

      await createBlocks(blob, pageId, [linkBlock]);

      return { pageId, tableBlockId, voteUrl, resultsUrl };
    },
  });

  const handleEventSubmit = async (data: EventFormData) => {
    if (!selectedDocument || !encryptedBlob) return;

    setIsInserting(true);
    setInsertError(null);

    try {
      const selectedSlots = data.timeSlots.filter((slot) => slot.selected);
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";

      const result = await createEventMutation.mutateAsync({
        documentId: selectedDocument.id,
        eventTitle: data.title,
        description: data.description,
        location: data.location,
        timeSlots: selectedSlots,
        blob: encryptedBlob,
        baseUrl,
      });
      const history = addEventToHistory({
        blockId: result.tableBlockId,
        title: data.title,
        documentTitle: selectedDocument.title,
        blob: encryptedBlob,
        voteUrl: result.voteUrl,
        resultsUrl: result.resultsUrl,
        createdAt: Date.now(),
      });
      setEventHistory(history);
      router.push(result.resultsUrl);
    } catch (error) {
      setInsertError(
        error instanceof Error ? error.message : "Failed to create event"
      );
    } finally {
      setIsInserting(false);
    }
  };

  const handleReset = () => {
    setEncryptedBlob(null);
    setSelectedDocument(null);
    setInsertError(null);
  };

  return (
    <div className="p-8 min-h-screen bg-background">
      <div className="mx-auto space-y-8 max-w-4xl">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Craft Events
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect to your Craft documents
          </p>
        </div>

        {!encryptedBlob ? (
          <>
            <UrlForm onSubmit={handleUrlSubmit} />
            {eventHistory.length > 0 && (
              <Card>
                <CardHeader className="flex gap-4 justify-between items-center">
                  <CardTitle className="text-base font-semibold">
                    Previously accessed events
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHistoryVisible((prev) => !prev)}
                  >
                    {historyVisible ? "Hide history" : "Show history"}
                  </Button>
                </CardHeader>
                {historyVisible && (
                  <CardContent className="space-y-4">
                    {eventHistory.map((entry) => (
                      <div
                        key={entry.blockId}
                        className="flex flex-col p-4 rounded-lg border border-border hover:border-accent transition-all sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                        style={{
                          background: "var(--ar-card-gradient)",
                        }}
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {entry.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {entry.documentTitle
                              ? `${entry.documentTitle} · `
                              : ""}
                            {new Date(entry.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(entry.resultsUrl)}
                          >
                            View results
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => router.push(entry.voteUrl)}
                          >
                            Open voting
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            )}
          </>
        ) : !selectedDocument ? (
          <>
            <DocumentSelector
              encryptedBlob={encryptedBlob}
              onSelect={handleDocumentSelect}
              onBack={handleReset}
            />
          </>
        ) : (
          <>
            <EventForm
              documentTitle={selectedDocument.title}
              onSubmit={handleEventSubmit}
              onBack={() => {
                setSelectedDocument(null);
                setInsertError(null);
              }}
            />

            {isInserting && (
              <div
                aria-live="polite"
                className="flex gap-2 justify-center items-center px-4 py-2 text-sm font-medium rounded border text-accent-foreground bg-accent border-accent"
              >
                <span className="w-2 h-2 rounded-full animate-pulse bg-accent-foreground" />
                Creating a new event page...
              </div>
            )}

            {insertError && (
              <div className="p-3 text-sm text-center rounded border text-destructive-foreground bg-destructive/90 border-destructive/50">
                {insertError}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
