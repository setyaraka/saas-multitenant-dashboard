import { useAuth } from "@/store/auth";

const BASE = (import.meta.env.VITE_API_URL as string) ?? "";
const buildUrl = (path: string) =>
  `${BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

export type RequestInitExt = RequestInit & {
  tenantScoped?: boolean;
};

export class ApiError extends Error {
  status: number;
  info?: any;
  constructor(message: string, status: number, info?: any) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

export async function request<T = any>(
  path: string,
  init: RequestInitExt = {},
): Promise<T> {
  const url = buildUrl(path);
  const tenantScoped = init.tenantScoped ?? true;

  const { userToken, tenantToken, tenantId } = useAuth.getState();

  const token = tenantScoped ? tenantToken || userToken : userToken;

  const hdr: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };

  if (token) hdr.Authorization = `Bearer ${token}`;
  if (tenantScoped && tenantId) hdr["X-Tenant-Id"] = tenantId;

  const bodyIsPlainObject =
    init.body &&
    typeof init.body === "object" &&
    !(init.body instanceof FormData) &&
    !(init.body instanceof Blob);

  const res = await fetch(url, {
    ...init,
    headers: bodyIsPlainObject
      ? { "Content-Type": "application/json", ...hdr }
      : hdr,
    body: bodyIsPlainObject ? JSON.stringify(init.body) : init.body,
  });

  if (!res.ok) {
    let info: any = undefined;

    try {
      info = await res.json();
    } catch {
      // ignore
    }
    const msg =
      info?.message || info?.error || res.statusText || "Request error";

    throw new ApiError(msg, res.status, info);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();

  return (text ? JSON.parse(text) : undefined) as T;
}
