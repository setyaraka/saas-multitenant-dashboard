import { API_BASE } from "@/config";
import { useAuth } from "@/store/auth";

export type RequestInitExt = RequestInit & {
  tenantScoped?: boolean;
};

export class ApiError extends Error {
  status: number;
  data?: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const buildUrl = (path: string) =>
    `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

export async function request<T = any>(
  path: string,
  init: RequestInitExt = {},
): Promise<T> {
  const url = buildUrl(path);
  const tenantScoped = init.tenantScoped ?? true;

  const { userToken, tenantToken, tenantId } = useAuth.getState();

  const token = tenantScoped ? tenantToken || userToken : userToken;

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (tenantScoped && tenantId) headers["X-Tenant-Id"] = tenantId;

  const isForm = typeof FormData !== "undefined" && init.body instanceof FormData;
  const isBlob = typeof Blob !== "undefined" && init.body instanceof Blob;

  const bodyIsPlainObject =
    init.body &&
    typeof init.body === "object" &&
    !isForm &&
    !isBlob;

  const res = await fetch(url, {
    ...init,
    headers: bodyIsPlainObject
      ? { "Content-Type": "application/json", ...headers }
      : headers,
    body: bodyIsPlainObject ? JSON.stringify(init.body) : init.body,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => undefined) : await res.text();

  if (!res.ok) {
    const message =
      (isJson && (data?.message || data?.error)) ||
      `Request failed: ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}
