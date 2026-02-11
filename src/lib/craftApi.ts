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

  if (normalized.startsWith("http://")) {
    throw new Error("HTTP URLs are not allowed — use HTTPS for secure communication");
  }

  if (!normalized.startsWith("https://")) {
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
  apiKey?: string,
  options?: { folderId?: string; location?: string }
): Promise<DocumentsResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const params = new URLSearchParams();
  if (options?.folderId) params.set("folderId", options.folderId);
  if (options?.location) params.set("location", options.location);
  const qs = params.toString();
  const url = `${apiUrl}/documents${qs ? `?${qs}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch documents: ${response.statusText}`);
  }

  return response.json();
}

export interface CraftFolder {
  id: string;
  name: string;
  children?: CraftFolder[];
}

export interface FoldersResponse {
  items: CraftFolder[];
}

export async function fetchFolders(
  apiUrl: string,
  apiKey?: string
): Promise<FoldersResponse> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const response = await fetch(`${apiUrl}/folders`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch folders: ${response.statusText}`);
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

  const requestBody = {
    blocks,
    position: {
      position: "end",
      pageId: documentId,
    },
  };

  const url = `${apiUrl}/blocks`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // Try to get error details from response body
      let errorBody: string | unknown = "";
      try {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          errorBody = await response.json();
        } else {
          errorBody = await response.text();
        }
      } catch {
        // Could not read error response body
      }

      throw new Error(
        `Failed to insert blocks: ${response.status} ${response.statusText}${
          errorBody ? ` - ${JSON.stringify(errorBody)}` : ""
        }`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
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

  const url = `${apiUrl}/blocks?id=${encodeURIComponent(
    blockId
  )}&maxDepth=${maxDepth}`;
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
