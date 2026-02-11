"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle, CircleCheck } from "lucide-react";
import UrlForm from "@/components/urlForm";
import DocumentSelector from "@/components/documentSelector";
import EventForm from "@/components/eventForm";
import StepIndicator from "@/components/stepIndicator";
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
import TimezoneTester from "@/components/timezoneTester";
import { sanitizeInput, MAX_LENGTHS } from "@/lib/sanitize";

export default function Home() {
  const router = useRouter();
  const [encryptedBlob, setEncryptedBlob] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] =
    useState<CraftDocument | null>(null);
  const [isInserting, setIsInserting] = useState(false);
  const [insertError, setInsertError] = useState<string | null>(null);
  const [eventHistory, setEventHistory] = useState<EventHistoryEntry[]>([]);
  const [historyVisible, setHistoryVisible] = useState(true);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setEventHistory(loadEventHistory());
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
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

      const safeTitle = sanitizeInput(eventTitle, MAX_LENGTHS.title);
      const safeDescription = sanitizeInput(description, MAX_LENGTHS.description);
      const safeLocation = sanitizeInput(location, MAX_LENGTHS.location);

      const pageTitle = `${safeTitle} – Scheduling`;
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

      if (safeDescription) {
        blocks.push({
          type: "text",
          markdown: `📝 ${safeDescription}`,
        });
      }

      if (safeLocation) {
        blocks.push({
          type: "text",
          markdown: `📍 ${safeLocation}`,
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

      // Store timezone as a separate block BEFORE the table (hidden metadata)
      const { formatTimezoneBlock } = await import("@/lib/tableParser");
      const { getCurrentTimezone } = await import("@/lib/timezoneUtils");
      const creatorTimezone = getCurrentTimezone();

      const timezoneBlock = {
        type: "text",
        markdown: formatTimezoneBlock(creatorTimezone),
      };
      await createBlocks(blob, pageId, [timezoneBlock]);

      const tableHeaders = [
        "Name",
        ...timeSlots.map((slot) =>
          formatTableHeader(slot.date, creatorTimezone)
        ),
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
      )}&title=${encodedTitle}&justCreated=true`;
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
      setIsInserting(false);
      setSuccessUrl(result.resultsUrl);
      redirectTimer.current = setTimeout(() => {
        router.push(result.resultsUrl);
      }, 1200);
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
    setSuccessUrl(null);
  };

  const currentStep = !encryptedBlob ? 0 : !selectedDocument ? 1 : 2;

  const stepVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-12 mx-auto max-w-4xl sm:px-8 sm:py-16 lg:py-20">
        <div className="mb-12 text-center sm:mb-16">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Craft Events
          </h1>
          <p className="mb-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            The free Doodle alternative. No ads, no sign-ups, no data
            collection.
          </p>
          <Link href="/how-it-works">
            <Button variant="outline" size="sm" className="gap-2">
              Learn how it works
            </Button>
          </Link>
        </div>

        <div className="mb-8 sm:mb-10">
          <StepIndicator currentStep={currentStep} />
        </div>

        <div className="space-y-10 sm:space-y-12">
          {process.env.NODE_ENV === "development" && <TimezoneTester />}
          <AnimatePresence mode="wait">
            {!encryptedBlob ? (
              <motion.div
                key="step-0"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-10 sm:space-y-12"
              >
                <UrlForm onSubmit={handleUrlSubmit} />
                {eventHistory.length > 0 && (
                  <Card className="shadow-lg border-border/50">
                    <CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:justify-between sm:items-center">
                      <CardTitle className="text-lg font-semibold text-foreground">
                        Previously accessed events
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setHistoryVisible((prev) => !prev)}
                        className="self-start sm:self-auto"
                      >
                        {historyVisible ? "Hide history" : "Show history"}
                      </Button>
                    </CardHeader>
                    {historyVisible && (
                      <CardContent className="pt-0 space-y-3">
                        {eventHistory.map((entry) => (
                          <div
                            key={entry.blockId}
                            className="flex flex-col gap-3 p-4 rounded-lg border transition-all group border-border hover:border-accent/50 hover:shadow-sm bg-card/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="mb-1 text-sm font-semibold truncate text-foreground">
                                {entry.title}
                              </p>
                              <p className="text-xs leading-5 text-muted-foreground">
                                {entry.documentTitle
                                  ? `${entry.documentTitle} · `
                                  : ""}
                                {new Date(entry.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(entry.resultsUrl)}
                                className="flex-1 sm:flex-none"
                              >
                                View results
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => router.push(entry.voteUrl)}
                                className="flex-1 sm:flex-none"
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
              </motion.div>
            ) : !selectedDocument ? (
              <motion.div
                key="step-1"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <DocumentSelector
                  encryptedBlob={encryptedBlob}
                  onSelect={handleDocumentSelect}
                  onBack={handleReset}
                />
              </motion.div>
            ) : (
              <motion.div
                key="step-2"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-10 sm:space-y-12"
              >
                <EventForm
                  documentTitle={selectedDocument.title}
                  onSubmit={handleEventSubmit}
                  onBack={() => {
                    setSelectedDocument(null);
                    setInsertError(null);
                  }}
                />

                <AnimatePresence mode="wait">
                  {isInserting && (
                    <motion.div
                      key="creating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      aria-live="polite"
                      className="flex gap-3 justify-center items-center px-5 py-3 text-sm font-medium rounded-lg border shadow-sm text-accent-foreground bg-accent/50 border-accent/50"
                    >
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      Creating a new event page...
                    </motion.div>
                  )}

                  {successUrl && (
                    <motion.div
                      key="success"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="flex gap-3 justify-center items-center px-5 py-3 text-sm font-medium rounded-lg border shadow-sm text-accent-foreground bg-accent/50 border-accent/50"
                    >
                      <CircleCheck className="w-5 h-5" />
                      Event created!
                    </motion.div>
                  )}
                </AnimatePresence>

                {insertError && (
                  <div className="p-4 text-sm text-center rounded-lg border shadow-sm text-destructive-foreground bg-destructive/90 border-destructive/50">
                    {insertError}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
