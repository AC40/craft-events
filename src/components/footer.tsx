import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white py-8 mt-auto">
      <div className="mx-auto max-w-4xl px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-600">
            © {currentYear} Craft Events. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link
              href="/impress"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Impress
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

