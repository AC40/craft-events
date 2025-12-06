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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">Redirecting to home...</p>
      </div>
    </div>
  );
}


