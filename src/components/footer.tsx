import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ar-footer mt-auto">
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
      <a
        href="mailto:contact@aaronrichter.tech?subject=Feedback%20-%20Craft%20Events"
        className="text-sm transition-colors text-muted-foreground hover:text-accent"
      >
        Feedback
      </a>
      <span className="ar-footer__badge">
        &copy; {currentYear} Craft Events
      </span>
    </footer>
  );
}
