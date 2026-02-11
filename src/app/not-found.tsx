"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to root after a brief delay
    const timer = setTimeout(() => {
      router.push("/");
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <section className="ar-section min-h-screen">
      <div className="ar-section__inner flex items-center justify-center min-h-[60vh]">
        <div className="text-center ar-fade-in">
          <h1 className="mb-4 text-2xl font-bold">Page not found</h1>
          <p className="text-muted-foreground">Redirecting to home...</p>
        </div>
      </div>
    </section>
  );
}
