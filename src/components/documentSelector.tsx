import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { getDocuments } from "@/app/actions";
import type { CraftDocument } from "@/lib/craftApi";

interface DocumentSelectorProps {
  encryptedBlob: string;
  onSelect: (document: CraftDocument) => void;
  onBack?: () => void;
}

export default function DocumentSelector({
  encryptedBlob,
  onSelect,
  onBack,
}: DocumentSelectorProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["documents", encryptedBlob],
    queryFn: () => getDocuments(encryptedBlob),
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Loading documents...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-sm text-destructive-foreground bg-destructive/90 p-3 rounded border border-destructive/50">
            {error instanceof Error
              ? error.message
              : "Failed to load documents"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const documents = data?.items.filter((doc) => !doc.isDeleted) || [];

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
        <CardDescription>Choose a document to work with</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {documents.map((doc) => (
            <Button
              key={doc.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => onSelect(doc)}
            >
              {doc.title}
            </Button>
          ))}
        </div>
        {onBack && (
          <div className="pt-2 border-t">
            <Button variant="ghost" className="w-full" onClick={onBack}>
              ← Back
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
