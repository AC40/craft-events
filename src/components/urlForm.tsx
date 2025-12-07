import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { normalizeApiUrl } from "@/lib/craftApi";

interface UrlFormProps {
  onSubmit: (apiUrl: string, apiKey?: string) => Promise<void>;
}

export default function UrlForm({ onSubmit }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError("Please enter a Craft doc URL");
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedUrl = normalizeApiUrl(url);
      await onSubmit(normalizedUrl, apiKey.trim() || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid URL format");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-xl font-semibold">Connect to Craft</CardTitle>
        <CardDescription className="text-sm leading-6">
          Enter your Craft document URL to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              Craft Doc URL
            </Label>
            <Input
              id="url"
              type="text"
              placeholder="https://connect.craft.do/links/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isSubmitting}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-sm font-medium">
              API Key <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter API key if secured"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isSubmitting}
              className="h-11"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive-foreground bg-destructive/90 p-3.5 rounded-lg border border-destructive/50">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-11 font-medium" 
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? "Connecting..." : "Connect"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
