import type { Metadata } from "next";
import { Providers } from "./providers";
import Footer from "@/components/footer";
import "../index.css";

export const metadata: Metadata = {
  title: "Craft Events",
  description: "Event scheduling with Craft documents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
