"use client";

import { SWRConfig } from "swr";
import { apiClient } from "@/lib/api/client";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: apiClient.get,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}
