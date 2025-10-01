import { useAuth } from "@/store/auth";

const API_BASE =
  (import.meta.env.VITE_API_URL?.replace(/\/+$/, "") as string) ?? "";

export type RequestOpts = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  tenantScoped?: boolean;
  xTenantId?: string;
  signal?: AbortSignal;
};

export type MultipartOpts = Omit<RequestOpts, "body"> & {
  form: FormData;
};

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, data: any, message?: string) {
    super(message ?? data?.error ?? data?.message ?? `HTTP ${status}`);
    this.status = status;
    this.data = data;
  }
}

// ---------- Helpers ----------
function joinUrl(base: string, path: string) {
  if (!path) return base;
  if (path.startsWith("http")) return path;

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function extractTenantIdFromPath(path: string): string | undefined {
  const m = path.match(/\/tenants\/([^/]+)/i);

  return m?.[1];
}

async function doFetch<T>(
  path: string,
  opts: RequestOpts,
  isMultipart = false,
): Promise<T> {
  const url = joinUrl(API_BASE, path);

  const { userToken, tenantToken, tenantId } = useAuth.getState() as any;

  const tenantScoped = opts.tenantScoped ?? /^\/tenants\//i.test(path);

  const headers: Record<string, string> = {
    ...(opts.headers || {}),
  };

  if (!isMultipart) headers["Content-Type"] = "application/json";

  if (tenantScoped) {
    if (!tenantToken) throw new ApiError(401, null, "No tenant token");
    headers["Authorization"] = `Bearer ${tenantToken}`;
    const tid =
      opts.xTenantId ?? extractTenantIdFromPath(path) ?? tenantId ?? "";

    if (tid) headers["X-Tenant-Id"] = tid;
  } else {
    if (!userToken) throw new ApiError(401, null, "No user token");
    headers["Authorization"] = `Bearer ${userToken}`;
  }

  const init: RequestInit = {
    method: opts.method ?? (opts.body ? "POST" : "GET"),
    headers,
    signal: opts.signal,
  };

  if (isMultipart) {
    (init as any).body = (opts as any).form;
  } else if (opts.body !== undefined) {
    init.body = JSON.stringify(opts.body);
  }

  const res = await fetch(url, init);

  const raw = await res.text();
  let payload: any = null;

  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = raw;
    }
  }

  if (!res.ok) {
    if (res.status === 401) {
      try {
        useAuth.getState().reset?.();
      } catch {}
    }
    throw new ApiError(res.status, payload);
  }

  return payload as T;
}

// ---------- Public API ----------
export async function request<T>(
  path: string,
  opts: RequestOpts = {},
): Promise<T> {
  return doFetch<T>(path, opts, false);
}

export async function requestMultipart<T>(
  path: string,
  opts: MultipartOpts,
): Promise<T> {
  return doFetch<T>(path, opts as RequestOpts, true);
}
