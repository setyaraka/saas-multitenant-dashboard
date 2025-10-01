import { request, requestMultipart } from "@/lib/request";

export type SettingsResp = {
  appearance: {
    brandName: string | null;
    primaryColor: string | null;
    accent: string | null;
    logoUrl: string | null;
    mode: "LIGHT" | "DARK" | "SYSTEM" | null;
    density: "COMFORTABLE" | "COMPACT" | null;
    fontFamily: string | null;
  };
  localization: {
    locale: string | null;
    currency: string | null;
    timezone: string | null;
  };
  domain: {
    domain: string | null;
    status: "not_verified" | "verifying" | "active" | "failed";
    autoHttps?: boolean;
    verifiedAt?: string | null;
  } | null;
  logoUrl: string | null;
};

export type UpdateAppearanceDto = {
  brandName?: string;
  primaryColor?: string;
  accent?: string;
  logoUrl?: string;
  mode?: "LIGHT" | "DARK" | "SYSTEM";
  density?: "COMFORTABLE" | "COMPACT";
  fontFamily?: string;
};

export type UpdateLocalizationDto = {
  locale?: string;
  language?: string;
  currency?: string;
  timezone?: string;
};
export type UpdateDomainDto = { domain?: string; autoHttps?: boolean };

export const TenantsApi = {
  getSettings: (tenantId: string) =>
    request<SettingsResp>(`/tenants/${tenantId}/settings`, {
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
};
