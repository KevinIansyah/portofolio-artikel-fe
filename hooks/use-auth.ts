"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@/lib/types/user";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";

interface LoginResponse {
  user: User;
  token: string;
  token_type: string;
}

interface UseAuthOptions {
  initialUser?: User | null;
}

export function useAuth(options: UseAuthOptions = {}) {
  const router = useRouter();
  const { initialUser } = options;

  // Hanya fetch user jika ada token di cookie
  const hasToken = typeof window !== "undefined" && !!apiClient.getToken();

  const {
    data: user,
    error,
    mutate,
  } = useSWR<User>(hasToken ? "/api/me" : null, apiClient.get, {
    fallbackData: initialUser || undefined,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<LoginResponse>("/api/login", {
        email,
        password,
      });

      // Simpan token ke cookie
      apiClient.setToken(response.token);

      // Set user data ke SWR cache
      mutate(response.user, false);

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("An unexpected error occurred", 500);
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      const response = await apiClient.post<LoginResponse>("/api/register", {
        name,
        email,
        password,
        password_confirmation,
      });

      apiClient.setToken(response.token);
      mutate(response.user, false);

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("An unexpected error occurred", 500);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/api/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      apiClient.removeToken();
      mutate(undefined, false);
      router.push("/login");
      router.refresh();
    }
  };

  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(user.role);
  };

  const isAdmin = () => hasRole("admin");
  const isAuthor = () => hasRole("author");
  const isVisitor = () => hasRole("visitor");
  const canManageArticles = () => hasRole(["admin", "author"]);

  return {
    user,
    isLoading: hasToken && !error && !user,
    isError: error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
    isAuthor,
    isVisitor,
    canManageArticles,
  };
}
