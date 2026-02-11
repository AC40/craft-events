import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <section className="ar-section min-h-screen">
      <div className="ar-section__inner">
        <div className="mx-auto max-w-4xl ar-fade-in">
          <div className="mb-10">
            <Link href="/">
              <Button variant="ghost" size="sm" className="-ml-2">
                ← Back to home
              </Button>
            </Link>
          </div>

          <div className="ar-prose">
            <h1>Privacy Policy</h1>

            <h2>Data Protection</h2>
            <p>
              The operators of this website take the protection of your
              personal data very seriously. We treat your personal data
              confidentially and in accordance with the statutory data
              protection regulations and this privacy policy.
            </p>

            <h2>Data Processing</h2>

            <h3>API Credentials</h3>
            <p>
              When you enter your Craft API URL and API key, this
              information is encrypted on the server using AES-GCM
              encryption before being stored or transmitted. The encrypted
              data is included in URLs you share, but the original
              credentials cannot be recovered without the server's master
              encryption key.
            </p>

            <h3>Browser Storage</h3>
            <p>
              Event history is stored locally in your browser's cookies.
              This data is not transmitted to any server and remains on
              your device.
            </p>

            <h3>Server-Side Processing</h3>
            <p>
              API requests to Craft are made server-side. Your API
              credentials are decrypted only on the server for the purpose
              of making these API calls and are never exposed to the
              client browser.
            </p>

            <h2>Contact</h2>
            <p>
              If you have any questions about this privacy policy, please
              contact the website administrator.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
