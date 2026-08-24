import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh for 5 min
      gcTime: 1000 * 60 * 30, // 30 minutes - cache lives 30 min
      refetchOnWindowFocus: false, // Don't spam refetches on tab switch
      retry: 1, // Retry failed requests once
    },
  },
});