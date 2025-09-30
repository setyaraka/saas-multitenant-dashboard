import { request } from "@/lib/api";
import {
  AppearanceDto,
  LocalizationDto,
  DomainDto,
  TenantSettings,
  CapabilitiesResp,
} from "@/types/api";

export const TenantsApi = {
  getSettings(tenantId: string) {
    return request<{ tenantId: string; settings: TenantSettings | any }>(
      `/tenants/${tenantId}/settings`,
      { method: "GET" },
    );
  },

  getCapabilities(tenantId: string) {
    return request<CapabilitiesResp>(`/tenants/${tenantId}/capabilities`, {
      method: "GET",
    });
  },

  updateAppearance(tenantId: string, body: AppearanceDto) {
    return request<TenantSettings>(`/tenants/${tenantId}/settings/appearance`, {
      method: "PATCH",
      body,
    });
  },

  updateLocalization(tenantId: string, body: LocalizationDto) {
    return request<TenantSettings>(
      `/tenants/${tenantId}/settings/localization`,
      { method: "PATCH", body },
    );
  },

  updateDomain(tenantId: string, body: DomainDto) {
    return request<TenantSettings>(`/tenants/${tenantId}/settings/domain`, {
      method: "PATCH",
      body,
    });
  },

  uploadLogo(tenantId: string, file: File) {
    const fd = new FormData();

    fd.append("file", file);

    return request<TenantSettings>(`/tenants/${tenantId}/brand/logo`, {
      method: "POST",
      body: fd,
    });
  },
};
