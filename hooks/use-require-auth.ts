"use client";

import { UserRole } from "@/lib/types/user";
import { useAuth } from "./use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UseRequireAuthOptions {
  roles?: UserRole | UserRole[];
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { user, isLoading, hasRole } = useAuth();
  const router = useRouter();
  const { roles } = options;

  useEffect(() => {
    if (!isLoading && user && roles) {
      if (!hasRole(roles)) {
        router.push("/unauthorized");
      }
    }
  }, [user, isLoading, roles, hasRole, router]);

  return { user, isLoading };
}
