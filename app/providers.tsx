"use client";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";

import { fetcher } from "../util/fetcher";

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        {children}
      </SWRConfig>
    </SessionProvider>
  );
}
