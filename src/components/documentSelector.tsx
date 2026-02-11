import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, FolderOpen, FileText, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { getDocuments, getFolders, getDocumentsInFolder } from "@/app/actions";
import type { CraftDocument, CraftFolder } from "@/lib/craftApi";
import type { CraftConnectionType } from "@/types/connection";

interface DocumentSelectorProps {
  encryptedBlob: string;
  connectionType?: CraftConnectionType;
  onSelect: (document: CraftDocument) => void;
  onBack?: () => void;
  onChangeConnection?: () => void;
}

export default function DocumentSelector({
  encryptedBlob,
  connectionType = "documents",
  onSelect,
  onBack,
  onChangeConnection,
}: DocumentSelectorProps) {
  if (connectionType === "daily_notes") {
    return (
      <DailyNotesMessage onBack={onBack} onChangeConnection={onChangeConnection} />
    );
  }

  if (connectionType === "folders") {
    return (
      <FolderBrowser
        encryptedBlob={encryptedBlob}
        onSelect={onSelect}
        onBack={onBack}
        onChangeConnection={onChangeConnection}
      />
    );
  }

  return (
    <FlatDocumentList
      encryptedBlob={encryptedBlob}
      onSelect={onSelect}
      onBack={onBack}
      onChangeConnection={onChangeConnection}
    />
  );
}

// -- Flat document list (original behavior for "documents" type) --

function FlatDocumentList({
  encryptedBlob,
  onSelect,
  onBack,
  onChangeConnection,
}: {
  encryptedBlob: string;
  onSelect: (document: CraftDocument) => void;
  onBack?: () => void;
  onChangeConnection?: () => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["documents", encryptedBlob],
    queryFn: () => getDocuments(encryptedBlob),
  });

  if (isLoading) return <SelectorSkeleton />;

  if (error) {
    return (
      <SelectorError
        message={error instanceof Error ? error.message : "Failed to load documents"}
        onBack={onBack}
        onChangeConnection={onChangeConnection}
      />
    );
  }

  const documents = data?.items.filter((doc) => !doc.isDeleted) ?? [];

  if (documents.length === 0) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No documents found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select a Document</CardTitle>
        <CardDescription>Choose a document to create your event in</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {documents.map((doc) => (
            <Button
              key={doc.id}
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => onSelect(doc)}
            >
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              {doc.title}
            </Button>
          ))}
        </div>
        <SelectorFooter onBack={onBack} onChangeConnection={onChangeConnection} />
      </CardContent>
    </Card>
  );
}

// -- Folder browser (for "folders" type) --

function FolderBrowser({
  encryptedBlob,
  onSelect,
  onBack,
  onChangeConnection,
}: {
  encryptedBlob: string;
  onSelect: (document: CraftDocument) => void;
  onBack?: () => void;
  onChangeConnection?: () => void;
}) {
  const [expandedFolderId, setExpandedFolderId] = useState<string | null>(null);

  const {
    data: foldersData,
    isLoading: foldersLoading,
    error: foldersError,
  } = useQuery({
    queryKey: ["folders", encryptedBlob],
    queryFn: () => getFolders(encryptedBlob),
  });

  // Also fetch unsorted documents (top-level)
  const { data: unsortedData, isLoading: unsortedLoading } = useQuery({
    queryKey: ["documents", encryptedBlob],
    queryFn: () => getDocuments(encryptedBlob),
  });

  if (foldersLoading) return <SelectorSkeleton />;

  if (foldersError) {
    return (
      <SelectorError
        message={
          foldersError instanceof Error
            ? foldersError.message
            : "Failed to load folders"
        }
        onBack={onBack}
        onChangeConnection={onChangeConnection}
      />
    );
  }

  const folders = foldersData?.items ?? [];
  const unsortedDocs =
    unsortedData?.items.filter((doc) => !doc.isDeleted) ?? [];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select a Document</CardTitle>
        <CardDescription>Browse folders to find your document</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          {/* Unsorted documents at the top */}
          {!unsortedLoading && unsortedDocs.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                Documents
              </p>
              {unsortedDocs.map((doc) => (
                <Button
                  key={doc.id}
                  variant="ghost"
                  className="w-full justify-start gap-2 h-9 text-sm"
                  onClick={() => onSelect(doc)}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  {doc.title}
                </Button>
              ))}
            </div>
          )}

          {/* Folders */}
          {folders.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1 mt-2">
                Folders
              </p>
              {folders.map((folder) => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  encryptedBlob={encryptedBlob}
                  isExpanded={expandedFolderId === folder.id}
                  onToggle={() =>
                    setExpandedFolderId((prev) =>
                      prev === folder.id ? null : folder.id
                    )
                  }
                  onSelectDocument={onSelect}
                />
              ))}
            </div>
          )}
        </div>
        <SelectorFooter onBack={onBack} onChangeConnection={onChangeConnection} />
      </CardContent>
    </Card>
  );
}

function FolderItem({
  folder,
  encryptedBlob,
  isExpanded,
  onToggle,
  onSelectDocument,
}: {
  folder: CraftFolder;
  encryptedBlob: string;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectDocument: (doc: CraftDocument) => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["folder-documents", encryptedBlob, folder.id],
    queryFn: () => getDocumentsInFolder(encryptedBlob, folder.id),
    enabled: isExpanded,
  });

  const docs = data?.items.filter((doc) => !doc.isDeleted) ?? [];

  return (
    <div>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 h-9 text-sm"
        onClick={onToggle}
      >
        <ChevronRight
          className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
        <FolderOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        {folder.name}
      </Button>
      {isExpanded && (
        <div className="ml-6 space-y-0.5">
          {isLoading ? (
            <div className="space-y-1 py-1">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-3/4" />
            </div>
          ) : docs.length === 0 ? (
            <p className="text-xs text-muted-foreground py-1 px-2">
              No documents
            </p>
          ) : (
            docs.map((doc) => (
              <Button
                key={doc.id}
                variant="ghost"
                className="w-full justify-start gap-2 h-8 text-xs"
                onClick={() => onSelectDocument(doc)}
              >
                <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
                {doc.title}
              </Button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// -- Daily notes unsupported message --

function DailyNotesMessage({
  onBack,
  onChangeConnection,
}: {
  onBack?: () => void;
  onChangeConnection?: () => void;
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Not Supported</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Daily Notes connections don&apos;t support document selection for event
          creation. Events need to be created inside a document.
        </p>
        <p className="text-sm text-muted-foreground">
          Please go back and choose a connection of type &ldquo;All Documents
          (Space)&rdquo; or &ldquo;Selected Documents&rdquo;.
        </p>
        <SelectorFooter onBack={onBack} onChangeConnection={onChangeConnection} />
      </CardContent>
    </Card>
  );
}

// -- Shared sub-components --

function SelectorSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function SelectorError({
  message,
  onBack,
  onChangeConnection,
}: {
  message: string;
  onBack?: () => void;
  onChangeConnection?: () => void;
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 space-y-4">
        <div className="text-sm text-destructive-foreground bg-destructive/90 p-3 rounded border border-destructive/50">
          {message}
        </div>
        <SelectorFooter onBack={onBack} onChangeConnection={onChangeConnection} />
      </CardContent>
    </Card>
  );
}

function SelectorFooter({
  onBack,
  onChangeConnection,
}: {
  onBack?: () => void;
  onChangeConnection?: () => void;
}) {
  if (!onBack && !onChangeConnection) return null;
  return (
    <div className="flex gap-2 pt-2 border-t">
      {onBack && (
        <Button variant="ghost" className="flex-1" onClick={onBack}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back
        </Button>
      )}
      {onChangeConnection && (
        <Button variant="ghost" className="flex-1" onClick={onChangeConnection}>
          Change connection
        </Button>
      )}
    </div>
  );
}
