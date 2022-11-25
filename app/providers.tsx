"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Analytics />
      </QueryClientProvider>
    </SessionProvider>
  );
}
