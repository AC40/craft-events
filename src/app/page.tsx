'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import UrlForm from '@/components/urlForm';
import DocumentSelector from '@/components/documentSelector';
import EventForm from '@/components/eventForm';
import { Button } from '@/components/ui/button';
import { insertBlocks, type CraftDocument } from '@/lib/craftApi';
import type { EventFormData } from '@/components/eventForm';

export default function Home() {
  const router = useRouter();
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);
  const [selectedDocument, setSelectedDocument] = useState<CraftDocument | null>(null);
  const [isInserting, setIsInserting] = useState(false);
  const [insertError, setInsertError] = useState<string | null>(null);
  const [insertSuccess, setInsertSuccess] = useState(false);

  const insertMutation = useMutation({
    mutationFn: async ({ documentId }: { documentId: string }) => {
      if (!apiUrl) throw new Error('API URL not set');
      
      const tableMarkdown = `| Name | Mo | Tu | We | Th | Fr |
|------|----|----|----|----|----|
|      |    |    |    |    |    |`;

      const pageBlock = {
        type: 'text',
        textStyle: 'page',
        markdown: 'Schedule',
      };

      const pageResponse = await insertBlocks(apiUrl, documentId, [pageBlock], apiKey);
      const pageId = pageResponse.items[0]?.id;
      
      if (!pageId) {
        throw new Error('Failed to get page ID after creation');
      }

      const tableBlock = {
        type: 'text',
        markdown: tableMarkdown,
      };

      await insertBlocks(apiUrl, pageId, [tableBlock], apiKey);
      
      return pageResponse;
    },
  });

  const handleUrlSubmit = (url: string, key?: string) => {
    setApiUrl(url);
    setApiKey(key);
    setSelectedDocument(null);
    setInsertSuccess(false);
    setInsertError(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('craftApiUrl', url);
      if (key) {
        localStorage.setItem('craftApiKey', key);
      } else {
        localStorage.removeItem('craftApiKey');
      }
    }
  };

  const handleDocumentSelect = async (document: CraftDocument) => {
    setSelectedDocument(document);
    setInsertError(null);
    setInsertSuccess(false);
  };

  const createEventMutation = useMutation({
    mutationFn: async ({
      documentId,
      eventTitle,
      description,
      location,
      timeSlots,
    }: {
      documentId: string;
      eventTitle: string;
      description: string;
      location: string;
      timeSlots: Array<{ date: Date; hour: number }>;
    }) => {
      if (!apiUrl) throw new Error('API URL not set');

      const { formatTableHeader } = await import('@/lib/tableParser');

      const pageTitle = `${eventTitle} – Scheduling`;
      const pageBlock = {
        type: 'text',
        textStyle: 'page',
        markdown: pageTitle,
      };

      const pageResponse = await insertBlocks(apiUrl, documentId, [pageBlock], apiKey);
      const pageId = pageResponse.items[0]?.id;

      if (!pageId) {
        throw new Error('Failed to get page ID after creation');
      }

      const blocks: Array<{ type: string; markdown?: string; textStyle?: string }> = [];

      if (description) {
        blocks.push({
          type: 'text',
          markdown: description,
        });
      }

      if (location) {
        blocks.push({
          type: 'text',
          markdown: location,
        });
      }

      if (blocks.length > 0) {
        await insertBlocks(apiUrl, pageId, blocks, apiKey);
      }

      const separatorBlock = {
        type: 'text',
        markdown: '---',
      };

      await insertBlocks(apiUrl, pageId, [separatorBlock], apiKey);

      const tableHeaders = ['Name', ...timeSlots.map((slot) => formatTableHeader(slot.date, slot.hour))];
      const tableSeparator = ['---', ...timeSlots.map(() => '---')];
      const organiserRow = ['Organiser', ...timeSlots.map(() => '✅')];

      const tableMarkdown = [
        `| ${tableHeaders.join(' | ')} |`,
        `| ${tableSeparator.join(' | ')} |`,
        `| ${organiserRow.join(' | ')} |`,
      ].join('\n');

      const tableBlock = {
        type: 'text',
        markdown: tableMarkdown,
      };

      const tableResponse = await insertBlocks(apiUrl, pageId, [tableBlock], apiKey);
      const tableBlockId = tableResponse.items[0]?.id;

      if (!tableBlockId) {
        throw new Error('Failed to get table block ID after creation');
      }

      return { pageId, tableBlockId };
    },
  });

  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  const handleEventSubmit = async (data: EventFormData) => {
    if (!selectedDocument) return;

    setIsInserting(true);
    setInsertError(null);
    setInsertSuccess(false);
    setCreatedEventId(null);

    try {
      const selectedSlots = data.timeSlots.filter((slot) => slot.selected);
      const result = await createEventMutation.mutateAsync({
        documentId: selectedDocument.id,
        eventTitle: data.title,
        description: data.description,
        location: data.location,
        timeSlots: selectedSlots,
      });
      setCreatedEventId(result.tableBlockId);
      setInsertSuccess(true);
    } catch (error) {
      setInsertError(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setIsInserting(false);
    }
  };

  const handleReset = () => {
    setApiUrl(null);
    setApiKey(undefined);
    setSelectedDocument(null);
    setInsertSuccess(false);
    setInsertError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Craft Events
          </h1>
          <p className="text-lg text-gray-600">
            Connect to your Craft documents
          </p>
        </div>

        {!apiUrl ? (
          <UrlForm onSubmit={handleUrlSubmit} />
        ) : !selectedDocument ? (
          <>
            <DocumentSelector
              apiUrl={apiUrl}
              apiKey={apiKey}
              onSelect={handleDocumentSelect}
            />
            <div className="text-center">
              <Button variant="outline" onClick={handleReset}>
                Use Different URL
              </Button>
            </div>
          </>
        ) : (
          <>
            <EventForm documentTitle={selectedDocument.title} onSubmit={handleEventSubmit} />
            
            {isInserting && (
              <div className="text-center text-sm text-muted-foreground">
                Creating event page...
              </div>
            )}
            
            {insertSuccess && createdEventId && apiUrl && (
              <div className="text-sm text-green-600 bg-green-50 p-4 rounded space-y-2">
                <div className="font-semibold">Successfully created event page!</div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Share this URL with participants:</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/event/${createdEventId}?apiUrl=${encodeURIComponent(apiUrl)}${apiKey ? `&apiKey=${encodeURIComponent(apiKey)}` : ''}`}
                      className="flex-1 px-2 py-1 text-xs border rounded bg-white font-mono"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/event/${createdEventId}?apiUrl=${encodeURIComponent(apiUrl)}${apiKey ? `&apiKey=${encodeURIComponent(apiKey)}` : ''}`;
                        await navigator.clipboard.writeText(url);
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {insertError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded text-center">
                {insertError}
              </div>
            )}
            
            <div className="text-center">
              <Button variant="outline" onClick={handleReset}>
                Select Different Document
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

