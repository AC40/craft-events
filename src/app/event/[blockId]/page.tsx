'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { getBlock, modifyBlock } from '@/app/actions';
import { parseMarkdownTable, parseTableToTimeSlots, updateTableWithVote, tableToMarkdown } from '@/lib/tableParser';
import VotingForm from '@/components/votingForm';
import ResultsView from '@/components/resultsView';

export default function EventView() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const blockId = params.blockId as string;
  const encryptedBlob = searchParams.get('blob');
  const viewMode = searchParams.get('view') || 'vote';

  const { data: block, isLoading, error } = useQuery({
    queryKey: ['block', blockId, encryptedBlob],
    queryFn: () => {
      if (!encryptedBlob || !blockId) throw new Error('Missing encrypted blob or block ID');
      return getBlock(encryptedBlob, blockId, 0);
    },
    enabled: !!encryptedBlob && !!blockId,
  });

  const getMarkdownFromBlock = (block: any): string | null => {
    if (block?.markdown) {
      return block.markdown;
    }
    if (block?.blocks && Array.isArray(block.blocks) && block.blocks.length > 0) {
      return getMarkdownFromBlock(block.blocks[0]);
    }
    if (block?.content && Array.isArray(block.content) && block.content.length > 0) {
      return getMarkdownFromBlock(block.content[0]);
    }
    return null;
  };

  const markdown = block ? getMarkdownFromBlock(block) : null;
  const table = markdown ? parseMarkdownTable(markdown) : null;
  const timeSlots = table ? parseTableToTimeSlots(table) : [];

  const updateMutation = useMutation({
    mutationFn: async ({ name, votes }: { name: string; votes: Record<number, boolean> }) => {
      if (!encryptedBlob || !blockId || !table) {
        throw new Error('Missing required data');
      }

      const updatedTable = updateTableWithVote(table, name, votes);
      const newMarkdown = tableToMarkdown(updatedTable);
      
      await modifyBlock(encryptedBlob, blockId, newMarkdown);
      
      return { name, votes };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['block', blockId, encryptedBlob] });
      router.push(`/event/${blockId}?blob=${encodeURIComponent(encryptedBlob || '')}&view=results`);
    },
  });

  const handleVoteSubmit = async (name: string, votes: Record<number, boolean>) => {
    await updateMutation.mutateAsync({ name, votes });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Loading event...</p>
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
                {error instanceof Error ? error.message : 'Failed to load event'}
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
              <p className="text-center text-muted-foreground mb-4">No table data found</p>
              {markdown && (
                <div className="text-xs text-muted-foreground">
                  <p className="mb-2">Markdown found:</p>
                  <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96 overflow-y-auto">{markdown}</pre>
                </div>
              )}
              {!markdown && (
                <div className="text-xs text-muted-foreground">
                  <p>Block structure:</p>
                  <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96 overflow-y-auto">{JSON.stringify(block, null, 2)}</pre>
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
              <p className="text-center text-muted-foreground mb-4">No time slots found in table</p>
              <div className="text-xs text-muted-foreground">
                <p className="mb-2">Table headers:</p>
                <pre className="bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(table.headers, null, 2)}</pre>
                <p className="mb-2 mt-4">Table rows:</p>
                <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96 overflow-y-auto">{JSON.stringify(table.rows, null, 2)}</pre>
                {markdown && (
                  <>
                    <p className="mb-2 mt-4">Raw markdown:</p>
                    <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-96 overflow-y-auto">{markdown}</pre>
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
      <div className="max-w-6xl mx-auto space-y-6">
        {viewMode === 'vote' ? (
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
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Want to update your vote?</p>
                  <button
                    onClick={() => {
                      router.push(`/event/${blockId}?blob=${encodeURIComponent(encryptedBlob || '')}&view=vote`);
                    }}
                    className="text-blue-600 hover:text-blue-700 underline text-sm"
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

