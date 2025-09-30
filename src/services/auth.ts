import { request } from "@/lib/api";
import {
  LoginBody,
  LoginResp,
  MeResp,
  MyTenantsResp,
  AssumeTenantByIdBody,
  AssumeTenantResp,
} from "@/types/api";

export const AuthApi = {
  login(body: LoginBody) {
    return request<LoginResp>("/auth/login", {
      method: "POST",
      body,
      tenantScoped: false,
    });
  },
  me() {
    return request<MeResp>("/auth/me", { method: "GET", tenantScoped: false });
  },
  myTenants() {
    return request<MyTenantsResp>("/auth/me/tenants", {
      method: "GET",
      tenantScoped: false,
    });
  },
  assumeTenantById(body: AssumeTenantByIdBody) {
    return request<AssumeTenantResp>("/auth/assume-tenant-by-id", {
      method: "POST",
      body,
      tenantScoped: false,
    });
  },
};
