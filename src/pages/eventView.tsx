import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { fetchBlock, updateBlock } from "@/lib/craftApi";
import {
  parseMarkdownTable,
  parseTableToTimeSlots,
  updateTableWithVote,
  tableToMarkdown,
} from "@/lib/tableParser";
import VotingForm from "@/components/votingForm";
import ResultsView from "@/components/resultsView";

export default function EventView() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const blockId = (params?.blockId as string) || "";
  const apiUrl = searchParams?.get("apiUrl") || null;
  const apiKey = searchParams?.get("apiKey") || undefined;
  const viewMode = searchParams?.get("view") || "vote";

  const {
    data: block,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["block", blockId, apiUrl, apiKey],
    queryFn: () => {
      if (!apiUrl || !blockId) throw new Error("Missing API URL or block ID");
      return fetchBlock(apiUrl, blockId, apiKey, 0);
    },
    enabled: !!apiUrl && !!blockId,
  });

  const getMarkdownFromBlock = (block: any): string | null => {
    if (block?.markdown) {
      return block.markdown;
    }
    if (
      block?.blocks &&
      Array.isArray(block.blocks) &&
      block.blocks.length > 0
    ) {
      return getMarkdownFromBlock(block.blocks[0]);
    }
    if (
      block?.content &&
      Array.isArray(block.content) &&
      block.content.length > 0
    ) {
      return getMarkdownFromBlock(block.content[0]);
    }
    return null;
  };

  const markdown = block ? getMarkdownFromBlock(block) : null;
  const table = markdown ? parseMarkdownTable(markdown) : null;
  const timeSlots = table ? parseTableToTimeSlots(table) : [];

  const updateMutation = useMutation({
    mutationFn: async ({
      name,
      votes,
    }: {
      name: string;
      votes: Record<number, boolean>;
    }) => {
      if (!apiUrl || !blockId || !table) {
        throw new Error("Missing required data");
      }

      const updatedTable = updateTableWithVote(table, name, votes);
      const newMarkdown = tableToMarkdown(updatedTable);

      await updateBlock(apiUrl, blockId, newMarkdown, apiKey);

      return { name, votes };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["block", blockId, apiUrl, apiKey],
      });
      router.push(
        `/event/${blockId}?apiUrl=${encodeURIComponent(apiUrl || "")}${
          apiKey ? `&apiKey=${encodeURIComponent(apiKey)}` : ""
        }&view=results`
      );
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
      <div className="p-8 min-h-screen bg-background">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Loading event...
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
              <div className="p-3 text-sm text-destructive-foreground bg-destructive/20 rounded">
                {error instanceof Error
                  ? error.message
                  : "Failed to load event"}
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
                  <pre className="overflow-auto overflow-y-auto p-2 max-h-96 bg-secondary rounded">
                    {markdown}
                  </pre>
                </div>
              )}
              {!markdown && (
                <div className="text-xs text-muted-foreground">
                  <p>Block structure:</p>
                  <pre className="overflow-auto overflow-y-auto p-2 max-h-96 bg-secondary rounded">
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
                <pre className="overflow-auto p-2 bg-secondary rounded">
                  {JSON.stringify(table.headers, null, 2)}
                </pre>
                <p className="mt-4 mb-2">Table rows:</p>
                <pre className="overflow-auto overflow-y-auto p-2 max-h-96 bg-secondary rounded">
                  {JSON.stringify(table.rows, null, 2)}
                </pre>
                {markdown && (
                  <>
                    <p className="mt-4 mb-2">Raw markdown:</p>
                    <pre className="overflow-auto overflow-y-auto p-2 max-h-96 bg-secondary rounded">
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
        {viewMode === "vote" ? (
          <VotingForm
            table={table}
            timeSlots={timeSlots}
            onSubmit={handleVoteSubmit}
          />
        ) : (
          <>
            <ResultsView table={table} timeSlots={timeSlots} />
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    Want to update your vote?
                  </p>
                  <button
                    onClick={() => {
                      router.push(
                        `/event/${blockId}?apiUrl=${encodeURIComponent(apiUrl || "")}${
                          apiKey ? `&apiKey=${encodeURIComponent(apiKey)}` : ""
                        }&view=vote`
                      );
                    }}
                    className="text-sm text-accent underline hover:text-accent/80"
                  >
                    Vote again
                  </button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
