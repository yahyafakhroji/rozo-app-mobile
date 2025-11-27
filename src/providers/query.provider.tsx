import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";

// Optimized QueryClient with proper caching configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 5 minutes before becoming stale
      staleTime: 1000 * 60 * 5,
      // Keep unused data in cache for 10 minutes
      gcTime: 1000 * 60 * 10,
      // Only retry once on failure
      retry: 1,
      // Don't refetch on window focus (mobile doesn't need this)
      refetchOnWindowFocus: false,
      // Refetch on reconnect if data is stale
      refetchOnReconnect: "always",
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  useReactQueryDevTools(queryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
