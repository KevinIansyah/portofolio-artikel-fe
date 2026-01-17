/**
 * API Server untuk Server Components & Server Actions
 */

import { cookies } from "next/headers";
import { ApiError, ApiSuccessResponse, isApiErrorResponse } from "../types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
async function buildHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const language = cookieStore.get("language")?.value || "id";

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": language,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// GET request
export async function get<T>(url: string): Promise<T> {
  const headers = await buildHeaders();

  const res = await fetch(`${API_URL}${url}`, {
    method: "GET",
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw await parseErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

// POST request
export async function post<T>(url: string, body?: unknown): Promise<T> {
  const headers = await buildHeaders();

  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers,
    credentials: "include",
    cache: "no-store",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw await parseErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

// PUT request
export async function put<T>(url: string, body?: unknown): Promise<T> {
  const headers = await buildHeaders();

  const res = await fetch(`${API_URL}${url}`, {
    method: "PUT",
    headers,
    credentials: "include",
    cache: "no-store",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw await parseErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

// DELETE request
export async function del<T>(url: string): Promise<T> {
  const headers = await buildHeaders();

  const res = await fetch(`${API_URL}${url}`, {
    method: "DELETE",
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw await parseErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

// PATCH request
export async function patch<T>(url: string, body?: unknown): Promise<T> {
  const headers = await buildHeaders();

  const res = await fetch(`${API_URL}${url}`, {
    method: "PATCH",
    headers,
    credentials: "include",
    cache: "no-store",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw await parseErrorResponse(res);
  }

  const data = await res.json();
  return extractData<T>(data);
}

export const apiServer = {
  get,
  post,
  put,
  delete: del,
  patch,
};
