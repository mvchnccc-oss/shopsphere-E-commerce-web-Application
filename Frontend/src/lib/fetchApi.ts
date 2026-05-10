"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FetchApiOptions {
  includeToken?: boolean;
  body?: unknown;
  cache?: RequestCache;
  next?: { revalidate?: number | false };
  /** Request timeout in milliseconds. Default: 15000 */
  timeout?: number;
}

export type FetchApiResult =
  | { status: "Success"; data: unknown }
  | {
      status: "Unauthorized" | "ServerNotFound" | "BadRequest" | "NotFound" | "Unknown";
      message?: string;
    };

// ─── Wrapper ──────────────────────────────────────────────────────────────────

export default async function fetchApi(
  api: string,
  method: string,
  options: FetchApiOptions
): Promise<FetchApiResult> {
  // ── Auth guard ──
  const session = await getServerSession(authOptions);
  if (options.includeToken && !session) {
    console.error(`[fetchApi] No session for authenticated request: ${method} ${api}`);
    return { status: "Unauthorized" };
  }

  if (options.includeToken && session && !(session as any).token) {
    console.error(`[fetchApi] Session exists but token is missing: ${method} ${api}`);
    return { status: "Unauthorized" };
  }

  // ── Headers ──
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (options.includeToken && session) {
    headers["Authorization"] = `Bearer ${(session as any).token}`;
  }

  // ── Fetch options ──
  const timeout = options.timeout ?? 15_000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const fetchOptions: RequestInit & { next?: { revalidate?: number | false } } = {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: controller.signal,
  };

  if (options.cache) {
    fetchOptions.cache = options.cache;
  }

  if (options.next) {
    fetchOptions.next = options.next;
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${api}`;

  try {
    const res = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    if (res.ok) {
      // Safely parse JSON only when the response has a body
      const contentType = res.headers.get("content-type") ?? "";
      const contentLength = res.headers.get("content-length");

      const hasBody =
        contentLength !== "0" &&
        contentType.includes("application/json");

      if (hasBody) {
        try {
          const data = await res.json();
          return { status: "Success", data };
        } catch {
          // Body exists but isn't valid JSON — treat as empty success
          return { status: "Success", data: null };
        }
      }

      return { status: "Success", data: null };
    }

    // ── Error responses ──
    let errorBody = "(no body)";
    try {
      errorBody = await res.text();
    } catch { /* ignore */ }

    console.error(
      `[fetchApi] ${method} ${api} → HTTP ${res.status}: ${errorBody}`
    );

    if (res.status === 401 || res.status === 403) return { status: "Unauthorized",  message: errorBody };
    if (res.status === 400)                        return { status: "BadRequest",    message: errorBody };
    if (res.status === 404)                        return { status: "NotFound",      message: errorBody };

    return { status: "Unknown", message: errorBody };

  } catch (e: unknown) {
    clearTimeout(timeoutId);

    const isTimeout = e instanceof Error && e.name === "AbortError";
    const label = isTimeout ? "Timeout" : "Network error";

    console.error(`[fetchApi] ${label} for ${method} ${api}:`, e);
    return {
      status: "ServerNotFound",
      message: isTimeout
        ? `Request timed out after ${timeout}ms`
        : String(e),
    };
  }
}