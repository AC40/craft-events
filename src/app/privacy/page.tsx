import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-8 py-12 mx-auto max-w-4xl">
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
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground">
            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Data Protection
              </h2>
              <p className="text-sm">
                The operators of this website take the protection of your
                personal data very seriously. We treat your personal data
                confidentially and in accordance with the statutory data
                protection regulations and this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Data Processing
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <h3 className="mb-1 font-medium text-foreground">
                    API Credentials
                  </h3>
                  <p>
                    When you enter your Craft API URL and API key, this
                    information is encrypted on the server using AES-GCM
                    encryption before being stored or transmitted. The encrypted
                    data is included in URLs you share, but the original
                    credentials cannot be recovered without the server's master
                    encryption key.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-medium text-foreground">
                    Browser Storage
                  </h3>
                  <p>
                    Event history is stored locally in your browser's cookies.
                    This data is not transmitted to any server and remains on
                    your device.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 font-medium text-foreground">
                    Server-Side Processing
                  </h3>
                  <p>
                    API requests to Craft are made server-side. Your API
                    credentials are decrypted only on the server for the purpose
                    of making these API calls and are never exposed to the
                    client browser.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Contact
              </h2>
              <p className="text-sm">
                If you have any questions about this privacy policy, please
                contact the website administrator.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
