import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Lock,
  Share2,
  Users,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Link2,
  Key,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="overflow-hidden relative bg-gradient-to-b border-b border-border from-background to-muted/20">
        <div className="px-6 py-24 mx-auto max-w-7xl lg:px-8 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-10 -ml-2">
                ← Back to home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              How Craft Events Works
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Create beautiful event scheduling pages directly in your Craft
              documents. Let participants vote on their availability, and view
              live results synced from your Craft document—all without exposing
              your API credentials.
            </p>
            <div className="flex flex-col gap-4 justify-center items-center mt-10 sm:flex-row sm:gap-6">
              <Link href="/">
                <Button size="lg" className="gap-2 min-w-[140px]">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#workflow">
                <Button variant="outline" size="lg" className="min-w-[140px]">
                  See the Workflow
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview Cards */}
      <section className="py-20 bg-muted/30 sm:py-24">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Craft Events?
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              The simplest way to schedule events using your existing Craft
              documents
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="pb-4">
                <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-lg bg-primary/10">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">Easy Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  Create event pages with time slots in seconds. No complex
                  setup required.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-lg bg-primary/10">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Secure by Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your API credentials are encrypted server-side. Never exposed
                  to browsers or stored in databases.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-lg bg-primary/10">
                  <Share2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Share Instantly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Share voting links with anyone. No Craft accounts needed for
                  participants.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-lg bg-primary/10">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Live Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View current availability anytime. Refresh the results page to
                  see the latest votes synced from your Craft document.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Create a Connection Section */}
      <section id="connection" className="py-24 bg-background">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How to Create a Connection
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started by setting up your Craft API connection
            </p>
          </div>

          <div className="space-y-24">
            {/* Step 1: Create API Connection */}
            <div className="relative">
              <div className="mb-8">
                <div className="flex gap-4 items-center mb-6">
                  <div className="flex justify-center items-center w-12 h-12 text-xl font-bold rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Create API Connection
                  </h3>
                </div>
                <p className="mb-6 text-lg text-muted-foreground">
                  Follow these steps to connect Craft Events to your Craft
                  workspace. You'll need your Craft API URL and optionally an
                  API key for authentication.
                </p>
              </div>

              {/* Three Screenshots Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src="/img/screen-craft-create.png"
                      alt="Step 1: Create new API Connection"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-center text-foreground">
                      Create new API Connection
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src="/img/screen-craft-select.jpeg"
                      alt="Step 2: Select connection type"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-center text-foreground">
                      Select connection type
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src="/img/screen-craft-url.jpeg"
                      alt="Step 3: Copy URL (and API key if needed)"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-center text-foreground">
                      Copy URL (and API key if needed)
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            {/* Step 2: Copy Link */}
            <div className="relative">
              <div className="flex flex-col gap-12 items-center lg:flex-row-reverse">
                <div className="flex-1">
                  <div className="flex gap-4 items-center mb-6">
                    <div className="flex justify-center items-center w-12 h-12 text-xl font-bold rounded-full bg-primary text-primary-foreground">
                      2
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      Copy Link & API Key
                    </h3>
                  </div>
                  <p className="mb-4 text-lg text-muted-foreground">
                    Once your connection is established, you'll receive an
                    encrypted link containing your credentials. You can also
                    optionally copy your API key if you need to use it again
                    later.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2 items-start">
                      <Link2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Copy the encrypted connection link with one click
                      </span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <Key className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Optionally copy your API key for future use</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Link contains encrypted credentials—safe to share
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src="/img/screen-connect.png"
                        alt="Copy link and API key interface"
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workflow Section */}
      <section id="workflow" className="py-24 bg-background">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              The Complete Workflow
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From connecting to Craft to sharing results—see how it all works
            </p>
          </div>

          <div className="space-y-24">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col gap-12 items-center lg:flex-row">
                <div className="flex-1">
                  <div className="flex gap-4 items-center mb-6">
                    <div className="flex justify-center items-center w-12 h-12 text-xl font-bold rounded-full bg-primary text-primary-foreground">
                      1
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      Connect to Craft
                    </h3>
                  </div>
                  <p className="mb-4 text-lg text-muted-foreground">
                    Start by entering your Craft API URL and optional API key.
                    These credentials are immediately encrypted on the server
                    using AES-GCM encryption before any storage or transmission.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Credentials encrypted server-side with AES-GCM
                      </span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>No credentials stored in databases</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Encrypted blob created for secure URL sharing</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src="/img/screen-connect.png"
                        alt="Connect to Craft - URL form screen"
                        fill
                        className="object-contain p-4"
                        priority
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <Separator />

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col gap-12 items-center lg:flex-row-reverse">
                <div className="flex-1">
                  <div className="flex gap-4 items-center mb-6">
                    <div className="flex justify-center items-center w-12 h-12 text-xl font-bold rounded-full bg-primary text-primary-foreground">
                      2
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      Select Your Document
                    </h3>
                  </div>
                  <p className="mb-4 text-lg text-muted-foreground">
                    Choose which Craft document you want to create the event in.
                    The server temporarily decrypts your credentials to fetch
                    your documents list, then immediately discards the decrypted
                    values.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Browse all your Craft documents</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Credentials only decrypted server-side, never in browser
                      </span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Clean document selector interface</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src="/img/screen-select.png"
                        alt="Select Your Document - Document selector screen"
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <Separator />

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col gap-12 items-center lg:flex-row">
                <div className="flex-1">
                  <div className="flex gap-4 items-center mb-6">
                    <div className="flex justify-center items-center w-12 h-12 text-xl font-bold rounded-full bg-primary text-primary-foreground">
                      3
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      Create Your Event
                    </h3>
                  </div>
                  <p className="mb-4 text-lg text-muted-foreground">
                    Define your event details: title, description, location, and
                    select available time slots. The server creates a new page
                    in your Craft document with a markdown table ready for
                    scheduling.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Add event title, description, and location</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Select multiple dates and time slots</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Event page automatically created in Craft</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src="/img/screen-creat.png"
                        alt="Create Your Event - Event form screen"
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <Separator />

            {/* Step 4 */}
            <div className="relative">
              <div className="flex flex-col gap-12 items-center lg:flex-row-reverse">
                <div className="flex-1">
                  <div className="flex gap-4 items-center mb-6">
                    <div className="flex justify-center items-center w-12 h-12 text-xl font-bold rounded-full bg-primary text-primary-foreground">
                      4
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      Share & Collect Votes
                    </h3>
                  </div>
                  <p className="mb-4 text-lg text-muted-foreground">
                    Share the voting link with participants. They can mark their
                    availability without needing Craft accounts. Votes are
                    written directly to your Craft document via the API.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Copy voting link with one click</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Participants vote without accounts</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Votes are written immediately to your Craft document
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src="/img/screen-share.png"
                        alt="Share & Collect Votes - Voting interface screen"
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <Separator />

            {/* Step 5 */}
            <div className="relative">
              <div className="flex flex-col gap-12 items-center lg:flex-row">
                <div className="flex-1">
                  <div className="flex gap-4 items-center mb-6">
                    <div className="flex justify-center items-center w-12 h-12 text-xl font-bold rounded-full bg-primary text-primary-foreground">
                      5
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      View Live Results
                    </h3>
                  </div>
                  <p className="mb-4 text-lg text-muted-foreground">
                    The results page reads the table from your Craft document
                    and displays current availability. Refresh the page to see
                    the latest votes. Anyone with the results link can view
                    availability, making it easy to coordinate schedules.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Current availability visualization</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Color-coded availability indicators</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Refresh to see latest votes from Craft</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Deep Dive */}
      <section className="py-24 bg-muted/30">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <div className="flex justify-center mb-4">
              <div className="flex justify-center items-center w-16 h-16 rounded-full bg-primary/10">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Security & Privacy
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Your credentials are protected with enterprise-grade encryption
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <Lock className="w-5 h-5 text-primary" />
                  AES-GCM Encryption
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your API credentials are encrypted using AES-GCM (Advanced
                  Encryption Standard - Galois/Counter Mode), the same
                  encryption used by major tech companies and governments.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>
                      PBKDF2 key derivation with server-side master key
                    </span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>
                      Unique 12-byte initialization vector per encryption
                    </span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>16-byte authentication tag prevents tampering</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>URL-safe Base64URL encoding for sharing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <Shield className="w-5 h-5 text-primary" />
                  Server-Side Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All API calls to Craft are made server-side using Next.js
                  Server Actions. Your credentials are decrypted only on the
                  server, used for the API call, and immediately discarded.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>No database storage of credentials</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>
                      Credentials never appear in browser network logs
                    </span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>
                      Decrypted values discarded immediately after use
                    </span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Master key stored as environment variable only</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>What You Control</CardTitle>
                <CardDescription>
                  You have full control over access and data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex gap-3 items-start">
                    <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">
                        Access Control
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Only people with voting or results URLs can access your
                        events
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">
                        Revocable Access
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Delete links or remove pages from Craft to revoke access
                        instantly
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">
                        Browser Storage
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Event history stored only in your browser cookies, never
                        transmitted to servers
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Open Source</p>
                      <p className="text-sm text-muted-foreground">
                        Review the codebase to verify security and privacy
                        practices
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <Card className="bg-gradient-to-br border-2 border-primary/20 from-primary/5 to-primary/10">
            <CardContent className="px-6 py-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                Create your first event scheduling page in minutes. No complex
                setup, no database required—just connect to Craft and start
                scheduling.
              </p>
              <div className="flex flex-col gap-4 justify-center items-center sm:flex-row">
                <Link href="/">
                  <Button size="lg" className="gap-2">
                    Create Your First Event
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/privacy">
                  <Button variant="outline" size="lg">
                    Read Privacy Policy
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
