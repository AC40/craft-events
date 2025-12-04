export interface CraftDocument {
  id: string;
  title: string;
  isDeleted: boolean;
}

export interface DocumentsResponse {
  items: CraftDocument[];
}

export function normalizeApiUrl(url: string): string {
  let normalized = url.trim();

  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = `https://${normalized}`;
  }

  if (!normalized.endsWith("/api/v1")) {
    if (normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }
    normalized = `${normalized}/api/v1`;
  }

  return normalized;
}

export async function fetchDocuments(
  apiUrl: string,
  apiKey?: string
): Promise<DocumentsResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const response = await fetch(`${apiUrl}/documents`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch documents: ${response.statusText}`);
  }

  return response.json();
}

export interface InsertBlockResponse {
  items: Array<{
    id: string;
    type: string;
    [key: string]: unknown;
  }>;
}

export async function insertBlocks(
  apiUrl: string,
  documentId: string,
  blocks: Array<{ type: string; markdown?: string; content?: unknown[] }>,
  apiKey?: string
): Promise<InsertBlockResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const response = await fetch(`${apiUrl}/blocks`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      blocks,
      position: {
        position: "end",
        pageId: documentId,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to insert blocks: ${response.statusText}`);
  }

  return response.json();
}

export interface Block {
  id: string;
  type: string;
  markdown?: string;
  content?: Block[];
  [key: string]: unknown;
}

export async function fetchBlock(
  apiUrl: string,
  blockId: string,
  apiKey?: string,
  maxDepth: number = -1
): Promise<Block> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const url = `${apiUrl}/blocks?id=${encodeURIComponent(blockId)}&maxDepth=${maxDepth}`;
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch block: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.blocks && Array.isArray(data.blocks) && data.blocks.length > 0) {
    return data.blocks[0];
  }

  return data;
}

export async function updateBlock(
  apiUrl: string,
  blockId: string,
  markdown: string,
  apiKey?: string
): Promise<Block> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const response = await fetch(`${apiUrl}/blocks`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      blocks: [
        {
          id: blockId,
          markdown,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update block: ${response.statusText}`);
  }

  const result = await response.json();
  return result.items?.[0] || result;
}
