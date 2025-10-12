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
  integration: UpdateIntegrationDto;
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
  language?: string;
  currency?: string;
  timezone?: string;
};

export type UpdateDomainDto = {
  domain?: string;
  autoHttps?: boolean;
};

export type UpdateIntegrationDto = {
  slackEnabled?: boolean;
  zapierEnabled?: boolean;
  webhookUrl?: string;
};
