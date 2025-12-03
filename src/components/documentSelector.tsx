import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { getDocuments } from '@/app/actions';
import type { CraftDocument } from '@/lib/craftApi';

interface DocumentSelectorProps {
  encryptedBlob: string;
  onSelect: (document: CraftDocument) => void;
}

export default function DocumentSelector({
  encryptedBlob,
  onSelect,
}: DocumentSelectorProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['documents', encryptedBlob],
    queryFn: () => getDocuments(encryptedBlob),
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading documents...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            {error instanceof Error ? error.message : 'Failed to load documents'}
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
        <CardDescription>
          Choose a document to work with
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}

