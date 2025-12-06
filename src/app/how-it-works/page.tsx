import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Lock, Share2, Users, CheckCircle2, ArrowRight, Shield, Zap } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-8">
                ← Back to home
              </Button>
            </Link>
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              How Craft Events Works
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Create beautiful event scheduling pages directly in your Craft documents. 
              Let participants vote on their availability, and see results update in real-time—all 
              without exposing your API credentials.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#workflow">
                <Button variant="outline" size="lg">
                  See the Workflow
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview Cards */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Craft Events?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The simplest way to schedule events using your existing Craft documents
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Easy Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create event pages with time slots in seconds. No complex setup required.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Secure by Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your API credentials are encrypted server-side. Never exposed to browsers or stored in databases.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Share Instantly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Share voting links with anyone. No Craft accounts needed for participants.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Real-Time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See availability update instantly as participants vote. Results sync with your Craft document.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Visual Workflow Section */}
      <section id="workflow" className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
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
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                      1
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Connect to Craft</h3>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    Start by entering your Craft API URL and optional API key. These credentials are 
                    immediately encrypted on the server using AES-GCM encryption before any storage or transmission.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Credentials encrypted server-side with AES-GCM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>No credentials stored in databases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Encrypted blob created for secure URL sharing</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video bg-muted flex items-center justify-center p-8">
                      <div className="text-center space-y-4">
                        <div className="text-4xl">📸</div>
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground">Screenshot Needed:</p>
                          <p className="text-sm text-muted-foreground">
                            <strong>URL Form Screen</strong>
                          </p>
                          <p className="text-xs text-muted-foreground max-w-md mx-auto">
                            Show the initial form where users enter their Craft API URL and optional API key. 
                            Include the input fields, submit button, and any helpful text or instructions. 
                            Should show a clean, welcoming interface.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <Separator />

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                      2
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Select Your Document</h3>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    Choose which Craft document you want to create the event in. The server temporarily 
                    decrypts your credentials to fetch your documents list, then immediately discards the 
                    decrypted values.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Browse all your Craft documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Credentials only decrypted server-side, never in browser</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Clean document selector interface</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video bg-muted flex items-center justify-center p-8">
                      <div className="text-center space-y-4">
                        <div className="text-4xl">📸</div>
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground">Screenshot Needed:</p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Document Selector Screen</strong>
                          </p>
                          <p className="text-xs text-muted-foreground max-w-md mx-auto">
                            Show the document selection interface with a list of Craft documents. 
                            Include document titles, selection buttons, and the "Use Different URL" option. 
                            Should demonstrate the clean, organized document list.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <Separator />

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                      3
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Create Your Event</h3>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    Define your event details: title, description, location, and select available time slots. 
                    The server creates a new page in your Craft document with a markdown table ready for scheduling.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Add event title, description, and location</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Select multiple dates and time slots</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Event page automatically created in Craft</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video bg-muted flex items-center justify-center p-8">
                      <div className="text-center space-y-4">
                        <div className="text-4xl">📸</div>
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground">Screenshot Needed:</p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Event Form Screen</strong>
                          </p>
                          <p className="text-xs text-muted-foreground max-w-md mx-auto">
                            Show the event creation form with fields for title, description, location, 
                            and the time slot selector. Include the calendar/date picker interface and 
                            the submit button. Should show a well-designed form with clear labels.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <Separator />

            {/* Step 4 */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                      4
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Share & Collect Votes</h3>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    Share the voting link with participants. They can mark their availability without 
                    needing Craft accounts. Votes are written directly to your Craft document via the API.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Copy voting link with one click</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Participants vote without accounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Votes update Craft document in real-time</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video bg-muted flex items-center justify-center p-8">
                      <div className="text-center space-y-4">
                        <div className="text-4xl">📸</div>
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground">Screenshot Needed:</p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Voting Interface Screen</strong>
                          </p>
                          <p className="text-xs text-muted-foreground max-w-md mx-auto">
                            Show the voting page where participants mark their availability. Include the 
                            event title, time slots with checkboxes, name input field, and submit button. 
                            Should show a clean, intuitive voting interface with the table layout visible.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            <Separator />

            {/* Step 5 */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                      5
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">View Live Results</h3>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    The results page reads the table from your Craft document and displays availability 
                    in real-time. Anyone with the results link can view current availability, making 
                    it easy to coordinate schedules.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Real-time availability visualization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Color-coded availability indicators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Results sync automatically with Craft</span>
                    </li>
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video bg-muted flex items-center justify-center p-8">
                      <div className="text-center space-y-4">
                        <div className="text-4xl">📸</div>
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground">Screenshot Needed:</p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Results View Screen</strong>
                          </p>
                          <p className="text-xs text-muted-foreground max-w-md mx-auto">
                            Show the results page with the availability table. Include participant names, 
                            time slots with availability indicators (checkmarks, colors, etc.), and the 
                            "Vote again" button. Should demonstrate the visual results display clearly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Deep Dive */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
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
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  AES-GCM Encryption
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your API credentials are encrypted using AES-GCM (Advanced Encryption Standard - 
                  Galois/Counter Mode), the same encryption used by major tech companies and governments.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>PBKDF2 key derivation with server-side master key</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Unique 12-byte initialization vector per encryption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>16-byte authentication tag prevents tampering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>URL-safe Base64URL encoding for sharing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Server-Side Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All API calls to Craft are made server-side using Next.js Server Actions. Your 
                  credentials are decrypted only on the server, used for the API call, and immediately discarded.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>No database storage of credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Credentials never appear in browser network logs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Decrypted values discarded immediately after use</span>
                  </li>
                  <li className="flex items-start gap-2">
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
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Access Control</p>
                      <p className="text-sm text-muted-foreground">
                        Only people with voting or results URLs can access your events
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Revocable Access</p>
                      <p className="text-sm text-muted-foreground">
                        Delete links or remove pages from Craft to revoke access instantly
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Local Storage</p>
                      <p className="text-sm text-muted-foreground">
                        Event history stored only in your browser, never transmitted
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Open Source</p>
                      <p className="text-sm text-muted-foreground">
                        Review the codebase to verify security and privacy practices
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
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="px-6 py-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
                Create your first event scheduling page in minutes. No complex setup, no database 
                required—just connect to Craft and start scheduling.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/">
                  <Button size="lg" className="gap-2">
                    Create Your First Event
                    <ArrowRight className="h-4 w-4" />
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
