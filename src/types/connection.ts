export type CraftConnectionType = "folders" | "documents" | "daily_notes";

export interface CraftConnection {
  id: string;
  name: string;
  url: string;
  type: CraftConnectionType;
  encryptedBlob: string;
  lastDocumentId?: string;
  lastDocumentTitle?: string;
  createdAt: number;
  updatedAt: number;
}
