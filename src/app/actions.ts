"use server";

import { encrypt, decrypt, type EncryptedSecrets } from "@/lib/crypto";
import {
  fetchDocuments,
  fetchFolders,
  fetchBlock,
  insertBlocks,
  updateBlock,
  type DocumentsResponse,
  type FoldersResponse,
  type Block,
  type InsertBlockResponse,
} from "@/lib/craftApi";
import type { CraftConnectionType } from "@/types/connection";

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
  try {
    const secrets = await decryptSecrets(encryptedBlob);
    const result = await insertBlocks(
      secrets.apiUrl,
      documentId,
      blocks,
      secrets.apiKey
    );
    return result;
  } catch (error) {
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

export async function decryptSecretsForEdit(
  encryptedBlob: string
): Promise<EncryptedSecrets> {
  return decryptSecrets(encryptedBlob);
}

export async function getFolders(
  encryptedBlob: string
): Promise<FoldersResponse> {
  const secrets = await decryptSecrets(encryptedBlob);
  return fetchFolders(secrets.apiUrl, secrets.apiKey);
}

export async function getDocumentsInFolder(
  encryptedBlob: string,
  folderId: string
): Promise<DocumentsResponse> {
  const secrets = await decryptSecrets(encryptedBlob);
  return fetchDocuments(secrets.apiUrl, secrets.apiKey, { folderId });
}

export async function getDocumentsByLocation(
  encryptedBlob: string,
  location: string
): Promise<DocumentsResponse> {
  const secrets = await decryptSecrets(encryptedBlob);
  return fetchDocuments(secrets.apiUrl, secrets.apiKey, { location });
}

export async function testConnection(
  encryptedBlob: string,
  type: CraftConnectionType
): Promise<{ ok: boolean; error?: string }> {
  try {
    const secrets = await decryptSecrets(encryptedBlob);
    if (type === "folders") {
      await fetchFolders(secrets.apiUrl, secrets.apiKey);
    } else {
      await fetchDocuments(secrets.apiUrl, secrets.apiKey);
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }
}
