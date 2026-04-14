"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TelemetryProvider } from "@/components/telemetryProvider";
import { ConnectionProvider } from "@/contexts/connectionContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  useEffect(() => {
    // Fresh bundle mounted successfully — clear the chunk-reload guard so a
    // future stale-bundle error in this tab can still trigger a reload.
    sessionStorage.removeItem("chunk-reload-attempted");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TelemetryProvider>
        <ConnectionProvider>{children}</ConnectionProvider>
      </TelemetryProvider>
    </QueryClientProvider>
  );
}
