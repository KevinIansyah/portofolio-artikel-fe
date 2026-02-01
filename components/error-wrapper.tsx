"use client";

import { useEffect } from "react";

import { toast } from "sonner";

interface ErrorWrapperProps {
  error?: {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
  } | null;
  children: React.ReactNode;
}

export function ErrorWrapper({ error, children }: ErrorWrapperProps) {
  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        description: error.errors ? Object.values(error.errors).flat().join(", ") : undefined,
        duration: 5000,
      });
    }
  }, [error]);

  return <>{children}</>;
}
