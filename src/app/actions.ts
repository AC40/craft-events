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
  const secrets = await decryptSecrets(encryptedBlob);
  return insertBlocks(secrets.apiUrl, documentId, blocks, secrets.apiKey);
}

export async function modifyBlock(
  encryptedBlob: string,
  blockId: string,
  markdown: string
): Promise<Block> {
  const secrets = await decryptSecrets(encryptedBlob);
  return updateBlock(secrets.apiUrl, blockId, markdown, secrets.apiKey);
}
