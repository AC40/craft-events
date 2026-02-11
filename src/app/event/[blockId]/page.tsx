"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { modifyBlock } from "@/app/actions";
import { updateTableWithVote, tableToMarkdown } from "@/lib/tableParser";
import VotingForm from "@/components/votingForm";
import { useEventTable } from "@/lib/useEventTable";
import { addEventToHistory } from "@/lib/eventHistory";
import { sanitizeInput, MAX_LENGTHS } from "@/lib/sanitize";
import { toast } from "sonner";

const MotionButton = motion.create(Button);

export default function EventView() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const updateMutation = useMutation({
    mutationFn: async ({
      name,
      votes,
    }: {
      name: string;
      votes: Record<number, boolean>;
    }) => {
      if (!encryptedBlob || !blockId || !table) {
        throw new Error("Missing required data");
      }

      const safeName = sanitizeInput(name, MAX_LENGTHS.participantName);
      const updatedTable = updateTableWithVote(table, safeName, votes);
      const newMarkdown = tableToMarkdown(updatedTable);
      await modifyBlock(encryptedBlob, blockId, newMarkdown);

      return { name, votes };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event_block", blockId, encryptedBlob],
      });
      toast.success("Vote submitted!");
      setTimeout(() => {
        router.push(
          `/event/${blockId}/results?blob=${encodeURIComponent(
            encryptedBlob || ""
          )}&title=${encodeURIComponent(eventTitle)}`
        );
      }, 800);
    },
  });

  const handleVoteSubmit = async (
    name: string,
    votes: Record<number, boolean>
  ) => {
    await updateMutation.mutateAsync({ name, votes });
  };

  if (isLoading) {
    return (
      <section className="ar-section min-h-screen">
        <div className="ar-section__inner">
          <div className="mx-auto max-w-6xl space-y-6">
          <div className="space-y-1">
            <Skeleton className="h-9 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[100px] w-full rounded-lg" />
                ))}
              </div>
              <Skeleton className="h-11 w-full" />
            </CardContent>
          </Card>
        </div>
        </div>
      </section>
    );
  }

  if (error || !block) {
    return (
      <section className="ar-section min-h-screen">
        <div className="ar-section__inner max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-destructive-foreground bg-destructive/90 p-3 rounded border border-destructive/50">
                {error instanceof Error
                  ? error.message
                  : "Failed to load event"}
              </div>
              {process.env.NODE_ENV === "development" && block && (
                <div className="mt-4 text-xs text-muted-foreground">
                  <pre>{JSON.stringify(block, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (!table) {
    return (
      <section className="ar-section min-h-screen">
        <div className="ar-section__inner max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground mb-4">
                No table data found
              </p>
              {process.env.NODE_ENV === "development" && markdown && (
                <div className="text-xs text-muted-foreground">
                  <p className="mb-2">Markdown found:</p>
                  <pre className="bg-secondary p-2 rounded overflow-auto max-h-96 overflow-y-auto">
                    {markdown}
                  </pre>
                </div>
              )}
              {process.env.NODE_ENV === "development" && !markdown && (
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
      </section>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <section className="ar-section min-h-screen">
        <div className="ar-section__inner max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground mb-4">
                No time slots found in table
              </p>
              {process.env.NODE_ENV === "development" && (
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
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="ar-section min-h-screen">
      <div className="ar-section__inner">
        <div className="mx-auto max-w-6xl space-y-6 ar-fade-in">
          <div className="space-y-1">
            <div className="mb-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  ← Back to home
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">Event polling</p>
            <h1 className="text-3xl font-semibold text-foreground">
              {eventTitle}
            </h1>
          </div>

          <VotingForm
            table={table}
            timeSlots={timeSlots}
            timezone={timezone}
            onSubmit={handleVoteSubmit}
            onBack={() => router.push("/")}
          />

          <Card>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Preview the current availability without submitting another vote.
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(
                    `/event/${blockId}/results?blob=${encodeURIComponent(
                      encryptedBlob || ""
                    )}&title=${encodeURIComponent(eventTitle)}`
                  )
                }
              >
                View live results
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
