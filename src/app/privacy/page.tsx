import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-12 mx-auto max-w-4xl sm:px-8 sm:py-16 lg:py-20">
        <div className="mb-10">
          <Link href="/">
            <Button variant="ghost" size="sm" className="-ml-2">
              ← Back to home
            </Button>
          </Link>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 text-foreground">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                Data Protection
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                The operators of this website take the protection of your
                personal data very seriously. We treat your personal data
                confidentially and in accordance with the statutory data
                protection regulations and this privacy policy.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">
                Data Processing
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-foreground">
                    API Credentials
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    When you enter your Craft API URL and API key, this
                    information is encrypted on the server using AES-GCM
                    encryption before being stored or transmitted. The encrypted
                    data is included in URLs you share, but the original
                    credentials cannot be recovered without the server's master
                    encryption key.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-foreground">
                    Browser Storage
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Event history is stored locally in your browser's cookies.
                    This data is not transmitted to any server and remains on
                    your device.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-foreground">
                    Server-Side Processing
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    API requests to Craft are made server-side. Your API
                    credentials are decrypted only on the server for the purpose
                    of making these API calls and are never exposed to the
                    client browser.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">Contact</h2>
              <p className="text-sm leading-6 text-muted-foreground">
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
