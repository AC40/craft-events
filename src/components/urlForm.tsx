import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { normalizeApiUrl } from '@/lib/craftApi';

interface UrlFormProps {
  onSubmit: (apiUrl: string, apiKey?: string) => Promise<void>;
}

export default function UrlForm({ onSubmit }: UrlFormProps) {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!url.trim()) {
      setError('Please enter a Craft doc URL');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const normalizedUrl = normalizeApiUrl(url);
      await onSubmit(normalizedUrl, apiKey.trim() || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid URL format');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect to Craft</CardTitle>
        <CardDescription>
          Enter your Craft document URL to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Craft Doc URL</Label>
            <Input
              id="url"
              type="text"
              placeholder="https://connect.craft.do/links/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key (optional)</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter API key if secured"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Connecting...' : 'Connect'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

