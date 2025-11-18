"use client";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function parseError(response: Response): Promise<string> {
  try {
    const payload = await response.json();
    return (
      payload?.message || payload?.detail || payload?.error || response.statusText
    );
  } catch {
    return response.statusText;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // HttpOnly JWT cookies are sent automatically
  });

  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message || "Unknown API error");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}
