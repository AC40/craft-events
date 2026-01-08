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

  const requestBody = {
    blocks,
    position: {
      position: "end",
      pageId: documentId,
    },
  };

  const url = `${apiUrl}/blocks`;

  // Log request details (excluding sensitive API key)
  console.log("[insertBlocks] Request details:", {
    url,
    method: "POST",
    documentId,
    blocksCount: blocks.length,
    blocks: blocks.map((b) => ({
      type: b.type,
      hasMarkdown: !!b.markdown,
      markdownLength: b.markdown?.length || 0,
      hasContent: !!b.content,
      contentLength: b.content?.length || 0,
      textStyle: (b as { textStyle?: string }).textStyle,
    })),
    hasApiKey: !!apiKey,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    // Log response status
    console.log("[insertBlocks] Response status:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
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
      } catch (e) {
        console.error("[insertBlocks] Failed to read error response body:", e);
      }

      console.error("[insertBlocks] Error details:", {
        status: response.status,
        statusText: response.statusText,
        errorBody,
        requestUrl: url,
        requestBody: JSON.stringify(requestBody, null, 2),
      });

      throw new Error(
        `Failed to insert blocks: ${response.status} ${response.statusText}${
          errorBody ? ` - ${JSON.stringify(errorBody)}` : ""
        }`
      );
    }

    const result = await response.json();
    console.log("[insertBlocks] Success:", {
      itemsCount: result.items?.length || 0,
      items: result.items?.map((item: { id: string; type: string }) => ({
        id: item.id,
        type: item.type,
      })),
    });

    return result;
  } catch (error) {
    console.error("[insertBlocks] Exception:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      url,
      documentId,
      blocksCount: blocks.length,
    });
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
