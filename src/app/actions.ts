"use server";

import { encrypt, decrypt, type EncryptedSecrets } from "@/lib/crypto";
import {
  fetchDocuments,
  fetchBlock,
  insertBlocks,
  updateBlock,
  type DocumentsResponse,
  type Block,
  type InsertBlockResponse,
} from "@/lib/craftApi";

function getMasterKey(): string {
  const masterKey = process.env.MASTER_KEY;
  if (!masterKey) {
    throw new Error("Server configuration error: MASTER_KEY not set");
  }
  return masterKey;
}

async function decryptSecrets(
  encryptedBlob: string
): Promise<EncryptedSecrets> {
  const masterKey = getMasterKey();
  return decrypt(encryptedBlob, masterKey);
}

export async function encryptSecrets(
  secrets: EncryptedSecrets
): Promise<string> {
  const masterKey = getMasterKey();
  return encrypt(secrets, masterKey);
}

export async function getDocuments(
  encryptedBlob: string
): Promise<DocumentsResponse> {
  const secrets = await decryptSecrets(encryptedBlob);
  return fetchDocuments(secrets.apiUrl, secrets.apiKey);
}

export async function getBlock(
  encryptedBlob: string,
  blockId: string,
  maxDepth: number = -1
): Promise<Block> {
  const secrets = await decryptSecrets(encryptedBlob);
  return fetchBlock(secrets.apiUrl, blockId, secrets.apiKey, maxDepth);
}

export async function createBlocks(
  encryptedBlob: string,
  documentId: string,
  blocks: Array<{
    type: string;
    markdown?: string;
    content?: unknown[];
    textStyle?: string;
  }>
): Promise<InsertBlockResponse> {
  console.log("[createBlocks] Creating blocks:", {
    documentId,
    blocksCount: blocks.length,
    blocks: blocks.map((b, i) => ({
      index: i,
      type: b.type,
      textStyle: b.textStyle,
      markdownPreview: b.markdown
        ? b.markdown.substring(0, 100) + (b.markdown.length > 100 ? "..." : "")
        : undefined,
      markdownLength: b.markdown?.length || 0,
      hasContent: !!b.content,
    })),
  });

  try {
    const secrets = await decryptSecrets(encryptedBlob);
    const result = await insertBlocks(
      secrets.apiUrl,
      documentId,
      blocks,
      secrets.apiKey
    );
    console.log("[createBlocks] Success:", {
      itemsCount: result.items?.length || 0,
    });
    return result;
  } catch (error) {
    console.error("[createBlocks] Error:", {
      error: error instanceof Error ? error.message : String(error),
      documentId,
      blocksCount: blocks.length,
    });
    throw error;
  }
}

export async function modifyBlock(
  encryptedBlob: string,
  blockId: string,
  markdown: string
): Promise<Block> {
  const secrets = await decryptSecrets(encryptedBlob);
  return updateBlock(secrets.apiUrl, blockId, markdown, secrets.apiKey);
}
