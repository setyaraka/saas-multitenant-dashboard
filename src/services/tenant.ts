import {
  SettingsResp,
  UpdateAccessibilityDTO,
  UpdateApiDTO,
  UpdateAppearanceDto,
  UpdateComplianceDTO,
  UpdateDomainDto,
  UpdateIntegrationDto,
  UpdateLocalizationDto,
  UpdateNotificationsDTO,
  UpdateProfileDTO,
  UpdateSSODTO,
} from "./dto/tenant-dto";

import { request, requestMultipart } from "@/lib/request";
import { CapabilitiesResp } from "@/types/api";

export const TenantsApi = {
  getSettings: (tenantId: string) =>
    request<SettingsResp>(`/tenants/${tenantId}/settings`, {
      method: "GET",
      tenantScoped: true,
    }),

  getCapabilities: (tenantId: string) =>
    request<CapabilitiesResp>(`/tenants/${tenantId}/capabilities`, {
      method: "GET",
      tenantScoped: true,
    }),

  updateAppearance: (tenantId: string, body: UpdateAppearanceDto) =>
    request<SettingsResp>(`/tenants/${tenantId}/settings/appearance`, {
      method: "PATCH",
      body,
      tenantScoped: true,
    }),

  updateLocalization: (tenantId: string, body: UpdateLocalizationDto) =>
    request<SettingsResp>(`/tenants/${tenantId}/settings/localization`, {
      method: "PATCH",
      body,
      tenantScoped: true,
    }),

  updateDomain: (tenantId: string, body: UpdateDomainDto) =>
    request<SettingsResp>(`/tenants/${tenantId}/settings/domain`, {
      method: "PATCH",
      body,
      tenantScoped: true,
    }),

  uploadLogo: (tenantId: string, file: File) => {
    const form = new FormData();

    form.append("file", file);

    return requestMultipart<{ logoUrl: string }>(
      `/tenants/${tenantId}/brand/logo`,
      { method: "POST", form, tenantScoped: true },
    );
  },

  updateIntegration: (tenantId: string, body: UpdateIntegrationDto) =>
    request<SettingsResp>(`/tenants/${tenantId}/settings/integration`, {
      method: "PATCH",
      body,
      tenantScoped: true,
    }),

  updateSso: (tenantId: string, body: UpdateSSODTO) =>
    request<SettingsResp>(`/tenants/${tenantId}/settings/sso`, {
      method: "POST",
      body,
      tenantScoped: true,
    }),

  updateProfile: (tenantId: string, body: UpdateProfileDTO) =>
    request<SettingsResp>(`/tenants/${tenantId}/settings/profile`, {
      method: "PATCH",
      body,
      tenantScoped: true,
    }),

  updateNotifications: (tenantId: string, body: UpdateNotificationsDTO) => 
    request<SettingsResp>(`/tenants/${tenantId}/settings/notifications`, {
      method: "PATCH",
      body,
      tenantScoped: true,
    }),

  updateAccessibility: (tenantId: string, body: UpdateAccessibilityDTO) => 
    request<SettingsResp>(`/tenants/${tenantId}/settings/accessibility`, {
      method: "PATCH",
      body,
      tenantScoped: true,
    }),

  updateCompliance: (tenantId: string, body: UpdateComplianceDTO) => 
    request<SettingsResp>(`/tenants/${tenantId}/settings/compliance`, {
      method: "PATCH",
      body,
      tenantScoped: true,
    }),

  updateApi: (tenantId: string, body: UpdateApiDTO) => 
    request<SettingsResp>(`/tenants/${tenantId}/settings/api`, {
      method: "PATCH",
      body,
      tenantScoped: true,
    }),
};
