import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 mt-auto border-t border-border bg-card">
      <div className="px-8 mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 justify-between items-center sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Craft Events. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link
              href="/how-it-works"
              className="text-sm transition-colors text-muted-foreground hover:text-accent"
            >
              How it works
            </Link>
            <Link
              href="/impress"
              className="text-sm transition-colors text-muted-foreground hover:text-accent"
            >
              Impress
            </Link>
            <Link
              href="/privacy"
              className="text-sm transition-colors text-muted-foreground hover:text-accent"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
