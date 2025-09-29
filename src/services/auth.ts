import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { get, post } from "@/lib/api";

export type LoginRequest = { email: string; password: string };
export type LoginResponse = {
  access_token: string;
  user: { id: string; email: string };
};
export type RoleCode = "OWNER" | "ADMIN" | "STAFF" | "VIEWER";

export type MeResponse = { userId: string; email: string };

export type MyTenant = {
  tenantId: string;
  tenantKey?: string;
  name?: string;
  role: RoleCode;
  permissions?: string[];
};

export type AssumeTenantByIdResponse = {
  tenantId: string;
  token: string; // tenant-scoped JWT
  permissions?: string[]; // izin per-tenant
};

export async function login(input: LoginRequest) {
  // POST /auth/login
  return post<LoginResponse>("auth/login", input, { tenantScoped: false });
}

export const getMe = () => get<MeResponse>("auth/me", { tenantScoped: false });
// export const getMe = (token: string) =>
//     get<MeResponse>("auth/me", {
//       tenantScoped: false,
//       headers: token ? { Authorization: `Bearer ${token}` } : undefined,
// });

export function useMeQuery(): UseQueryResult<MeResponse> {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: (failCount, err: any) =>
      err?.status === 401 ? false : failCount < 2,
  });
}

export const myTenants = () =>
  get<MyTenant[]>("auth/me/tenants", { tenantScoped: false });

export const assumeTenantById = (tenantId: string) =>
  post<AssumeTenantByIdResponse>(
    "auth/assume-tenant-by-id",
    { tenantId },
    { tenantScoped: false },
  );
