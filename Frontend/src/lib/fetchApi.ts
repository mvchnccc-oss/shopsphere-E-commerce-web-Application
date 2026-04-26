"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

interface FetchApiOptions {
  includeToken?: boolean;
  body?: any;
}

type FetchApiResult =
  | { status: "Success"; data: any }
  | {
      status: "Unauthorized" | "ServerNotFound" | "BadRequest" | "Unknown";
      message?: string;
    };

export default async function fetchApi(
  api: string,
  method: string,
  options: FetchApiOptions,
): Promise<FetchApiResult> {
  const session = await getServerSession(authOptions);
  if (!session && options.includeToken) return { status: "Unauthorized" };

  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (options.includeToken) {
    headers["Authorization"] = `Bearer ${session!.token}`;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/${api}`, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (res.ok) {
      const hasBody = res.headers.get("content-length") !== "0";
      return { status: "Success", data: hasBody ? await res.json() : null };
    }
    let status: "Unauthorized" | "ServerNotFound" | "BadRequest" | "Unknown" = "Unknown";

    if (res.status === 401 || res.status === 403) {
      status = "Unauthorized";
    } else if (res.status === 400) {
      status = "BadRequest";
    }

    console.error(`Request ${method} ${api} failed, ${status}`);
    return { status };
  } catch (e) {
    console.error(`Request ${method} ${api} failed, ServerNotFound`);
    return { status: "ServerNotFound", message: String(e) };
  }
}
