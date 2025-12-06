import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-8 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← Back to home
            </Button>
          </Link>
        </div>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">
              How does it work?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Overview
              </h2>
              <p className="text-sm">
                Craft Events allows you to create event scheduling pages directly
                in your Craft documents. Participants can vote on their
                availability, and results are displayed in real-time. All API
                credentials are encrypted and never exposed to the client
                browser.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                The Workflow
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    1. Connect to Craft
                  </h3>
                  <p>
                    You provide your Craft API URL and optional API key. These
                    credentials are immediately encrypted on the server using
                    AES-GCM encryption before any storage or transmission.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    2. Select Document
                  </h3>
                  <p>
                    Choose which Craft document you want to create the event in.
                    The server decrypts your credentials temporarily to fetch
                    your documents list, then discards the decrypted values.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    3. Create Event
                  </h3>
                  <p>
                    Define your event title, description, location, and select
                    available time slots. The server creates a new page in your
                    Craft document with a markdown table for scheduling.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    4. Share & Vote
                  </h3>
                  <p>
                    Share the voting link with participants. They can mark their
                    availability without needing Craft accounts. Votes are
                    written directly to your Craft document via the API.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    5. View Results
                  </h3>
                  <p>
                    The results page reads the table from your Craft document and
                    displays availability in real-time. Anyone with the results
                    link can view current availability.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Technical Architecture
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Encryption (AES-GCM)
                  </h3>
                  <p className="mb-2">
                    Your API credentials are encrypted using AES-GCM (Advanced
                    Encryption Standard - Galois/Counter Mode), a modern
                    authenticated encryption algorithm that provides both
                    confidentiality and integrity.
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                    <li>
                      <strong>Key Derivation:</strong> Uses PBKDF2 with a
                      server-side master key and random salt
                    </li>
                    <li>
                      <strong>Random IV:</strong> Each encryption uses a unique
                      12-byte initialization vector
                    </li>
                    <li>
                      <strong>Authentication Tag:</strong> 16-byte tag ensures
                      data integrity and prevents tampering
                    </li>
                    <li>
                      <strong>Base64URL Encoding:</strong> Encrypted blob is
                      URL-safe encoded for sharing
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Server-Side Processing
                  </h3>
                  <p>
                    All API calls to Craft are made server-side using Next.js
                    Server Actions. Your credentials are decrypted only on the
                    server, used for the API call, and immediately discarded.
                    The client browser never receives your API credentials in
                    plaintext.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    URL-Based Sharing
                  </h3>
                  <p>
                    The encrypted blob containing your credentials is embedded in
                    the URL as a query parameter. This allows the server to
                    decrypt and use your credentials for API calls without
                    storing them in a database. The encryption ensures that even
                    if someone intercepts the URL, they cannot recover your
                    credentials without the server's master key.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Real-Time Updates
                  </h3>
                  <p>
                    When participants vote, the server reads the current table
                    from Craft, updates it with the new vote, and writes it back.
                    The results page polls the Craft API to display the latest
                    availability, ensuring real-time synchronization.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Security & Safety
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Why It's Safe
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>No Database Storage:</strong> Your API credentials
                      are never stored in a database. They exist only in
                      encrypted form within URLs you control.
                    </li>
                    <li>
                      <strong>Server-Side Only:</strong> Decryption happens
                      exclusively on the server. Your browser never sees
                      plaintext credentials.
                    </li>
                    <li>
                      <strong>Strong Encryption:</strong> AES-GCM is used by
                      major tech companies and governments for sensitive data. It
                      provides both encryption and tamper detection.
                    </li>
                    <li>
                      <strong>Unique Per Encryption:</strong> Each encryption
                      uses a random salt and IV, meaning identical credentials
                      produce different encrypted blobs, preventing pattern
                      analysis.
                    </li>
                    <li>
                      <strong>Master Key Protection:</strong> The server's
                      master encryption key is stored as an environment variable
                      and never exposed to the client or included in URLs.
                    </li>
                    <li>
                      <strong>No Client-Side Exposure:</strong> API calls are
                      made server-to-server. Your Craft API credentials never
                      appear in browser network logs or JavaScript code.
                    </li>
                    <li>
                      <strong>Local Storage Only:</strong> Event history is
                      stored locally in your browser and never transmitted to any
                      server.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    What You Control
                  </h3>
                  <p>
                    You have full control over who can access your events. Only
                    people with the voting or results URLs can interact with
                    your event. You can revoke access by deleting the links or
                    removing the page from your Craft document.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Best Practices
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                    <li>Share links only with trusted participants</li>
                    <li>
                      Use Craft API keys with limited permissions when possible
                    </li>
                    <li>Regularly review and clean up old events</li>
                    <li>
                      Be cautious when sharing URLs publicly or in version
                      control systems
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Open Source & Transparency
              </h2>
              <p className="text-sm">
                This application is open source, meaning you can review the
                entire codebase to verify how encryption, API calls, and data
                handling work. The encryption implementation uses the Web Crypto
                API, a standard browser and Node.js interface for cryptographic
                operations.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

