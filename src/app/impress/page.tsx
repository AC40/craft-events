import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ImpressPage() {
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
              Impress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Information according to § 5 TMG
              </h2>
              <p className="text-sm">
                This website is provided as a service. For legal inquiries,
                please contact the website administrator.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Disclaimer
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Liability for Contents
                  </h3>
                  <p>
                    As service providers, we are liable for own contents of
                    these websites according to Sec. 7, paragraph 1 German
                    Telemedia Act (TMG). However, according to Sec. 8 to 10
                    German Telemedia Act (TMG), service providers are not under
                    obligation to permanently monitor submitted or stored
                    information or to search for evidences that indicate illegal
                    activities.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Liability for Links
                  </h3>
                  <p>
                    Our offer includes links to external third party websites.
                    We have no influence on the contents of those websites,
                    therefore we cannot guarantee for those contents. Providers
                    or administrators of linked websites are always responsible
                    for their own contents.
                  </p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

