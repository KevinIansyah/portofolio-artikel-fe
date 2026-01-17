/**
 * API Client untuk Client Components
 */

import { ApiError, ApiSuccessResponse, isApiErrorResponse } from "../types/api";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Cookie helpers
export const cookieHelpers = {
  setToken(token: string): void {
    if (typeof document === "undefined") return;

    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
  },

  getToken(): string | null {
    if (typeof document === "undefined") return null;

    const match = document.cookie.match(/auth_token=([^;]+)/);
    return match ? match[1] : null;
  },

  removeToken(): void {
    if (typeof document === "undefined") return;

    document.cookie = "auth_token=; path=/; max-age=0";
  },

  getLanguage(): string {
    return Cookies.get("language") || "id";
  },
};

// Error parser
async function parseErrorResponse(res: Response): Promise<ApiError> {
  let errorData: unknown;

  try {
    errorData = await res.json();
  } catch {
    return new ApiError("An error occurred while processing the request", res.status);
  }

  if (isApiErrorResponse(errorData)) {
    return new ApiError(errorData.message, res.status, errorData.errors || undefined);
  }

  return new ApiError("An unexpected error occurred", res.status);
}

// Extract data
function extractData<T>(responseData: unknown): T {
  if (responseData && typeof responseData === "object" && "data" in responseData) {
    const apiResponse = responseData as ApiSuccessResponse<T>;

    if ("meta" in apiResponse && apiResponse.meta) {
      return {
        data: apiResponse.data,
        ...apiResponse.meta,
      } as T;
    }

    return apiResponse.data;
  }

  return responseData as T;
}

// Build headers
function buildHeaders(): HeadersInit {
  const token = cookieHelpers.getToken();
  const language = cookieHelpers.getLanguage();

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": language,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// GET request
export async function get<T>(url: string): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "GET",
    headers: buildHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401) {
      cookieHelpers.removeToken();
    }
    throw await parseErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

// POST request
export async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: buildHeaders(),
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401) {
      cookieHelpers.removeToken();
    }
    throw await parseErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

// POST request with FormData
export async function postFormData<T>(url: string, formData: FormData): Promise<T> {
  const token = cookieHelpers.getToken();
  const language = cookieHelpers.getLanguage();

  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": language,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    if (res.status === 401) {
      cookieHelpers.removeToken();
    }
    throw await parseErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

// PUT request
export async function put<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: buildHeaders(),
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401) {
      cookieHelpers.removeToken();
    }
    throw await parseErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

// PUT request with FormData
export async function putFormData<T>(url: string, formData: FormData): Promise<T> {
  const token = cookieHelpers.getToken();
  const language = cookieHelpers.getLanguage();

  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": language,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    if (res.status === 401) {
      cookieHelpers.removeToken();
    }
    throw await parseErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

// DELETE request
export async function del<T>(url: string): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "DELETE",
    headers: buildHeaders(),
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401) {
      cookieHelpers.removeToken();
    }
    throw await parseErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

// PATCH request
export async function patch<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "PATCH",
    headers: buildHeaders(),
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401) {
      cookieHelpers.removeToken();
    }
    throw await parseErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

export const apiClient = {
  get,
  post,
  postFormData,
  put,
  putFormData,
  delete: del,
  patch,
  ...cookieHelpers,
};
