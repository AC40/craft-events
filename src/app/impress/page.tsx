import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ImpressPage() {
  return (
    <section className="ar-section min-h-screen">
      <div className="ar-section__inner">
        <div className="mx-auto max-w-4xl ar-fade-in">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← Back to home
              </Button>
            </Link>
          </div>

          <div className="ar-prose">
            <h1>Impress</h1>

            <h2>Information according to &sect; 5 TMG</h2>
            <p>
              This website is provided as a service. For legal inquiries,
              please contact the website administrator.
            </p>

            <h2>Disclaimer</h2>

            <h3>Liability for Contents</h3>
            <p>
              As service providers, we are liable for own contents of
              these websites according to Sec. 7, paragraph 1 German
              Telemedia Act (TMG). However, according to Sec. 8 to 10
              German Telemedia Act (TMG), service providers are not under
              obligation to permanently monitor submitted or stored
              information or to search for evidences that indicate illegal
              activities.
            </p>

            <h3>Liability for Links</h3>
            <p>
              Our offer includes links to external third party websites.
              We have no influence on the contents of those websites,
              therefore we cannot guarantee for those contents. Providers
              or administrators of linked websites are always responsible
              for their own contents.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
