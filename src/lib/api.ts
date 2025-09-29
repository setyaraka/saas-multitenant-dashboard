import { useAuth } from "@/store/auth";

export type ApiError = {
  status: number;
  code?: string;
  message: string;
  details?: unknown;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

const BASE_URL = (import.meta.env.VITE_API_URL as string) ?? "";

const buildUrl = (path: string) =>
  `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

function toError(status: number, body: any): ApiError {
  const message =
    body?.message ??
    body?.error ??
    (status === 401
      ? "Sesi berakhir. Silakan login kembali."
      : status === 403
        ? "Insufficient permission."
        : status === 422
          ? "Data tidak valid. Periksa kembali isian Anda."
          : "Terjadi kesalahan. Coba lagi.");

  return { status, code: body?.code, message, details: body };
}

type RequestInitExt = RequestInit & {
  tenantScoped?: boolean; // default true
  // Jika body object, otomatis JSON; jika FormData/Blob, biarkan.
};

export async function request<T>(
  path: string,
  init: RequestInitExt = {},
): Promise<T> {
  const url = buildUrl(path);
  const tenantScoped = init.tenantScoped ?? true;

  const { userToken, tenantToken, tenantId } = useAuth.getState();
  //   const token = tenantToken ?? userToken;
  const token =
    (init.tenantScoped ?? true) ? tenantToken || userToken : userToken;

  const hdr: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };

  if (token) hdr.Authorization = `Bearer ${token}`;
  if (tenantScoped && tenantId) hdr["X-Tenant-Id"] = tenantId;

  // Auto JSON serialize if body is plain object:
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
    body: bodyIsPlainObject ? JSON.stringify(init.body) : (init.body as any),
  });

  // Try parse JSON (fallback text)
  const text = await res.text();
  const isJson = (res.headers.get("content-type") || "").includes(
    "application/json",
  );
  const data = isJson ? (text ? JSON.parse(text) : null) : (text as any);

  if (!res.ok) {
    throw toError(res.status, data);
  }

  return data as T;
}

// Helpers
export const get = <T>(p: string, o?: RequestInitExt) =>
  request<T>(p, { ...o, method: "GET" });
export const post = <T>(p: string, body?: any, o?: RequestInitExt) =>
  request<T>(p, { ...o, method: "POST", body });
export const patch = <T>(p: string, body?: any, o?: RequestInitExt) =>
  request<T>(p, { ...o, method: "PATCH", body });
export const del = <T>(p: string, o?: RequestInitExt) =>
  request<T>(p, { ...o, method: "DELETE" });

// Upload example: kirim FormData (biarkan Content-Type otomatis)
export const upload = <T>(p: string, form: FormData, o?: RequestInitExt) =>
  request<T>(p, { ...o, method: "POST", body: form });
