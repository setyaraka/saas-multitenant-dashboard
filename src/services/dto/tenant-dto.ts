export type Mode = "LIGHT" | "DARK" | "SYSTEM";

export type Density = "COMFORTABLE" | "COMPACT";

export type Status = "not_verified" | "verifying" | "active" | "failed";

export type Sso = "disabled" | "saml" | "oidc-google" | "oidc-microsoft";

export type UserSetting = {
  email: string;
  name: string;
};

export type Apperance = {
  brandName: string | null;
  primaryColor: string | null;
  accent: string | null;
  logoUrl: string | null;
  mode: Mode | null;
  density: Density | null;
  fontFamily: string | null;
};

export type Localization = {
  locale: string | null;
  currency: string | null;
  timezone: string | null;
};

export type Domain = {
  domain: string | null;
  status: Status;
  autoHttps?: boolean;
  verifiedAt?: string | null;
};

export type SettingsResp = {
  appearance: Apperance;
  localization: Localization;
  domain: Domain | null;
  logoUrl: string | null;
  integration: UpdateIntegrationDto;
  users: UserSetting;
};

export type UpdateAppearanceDto = {
  brandName?: string;
  primaryColor?: string;
  accent?: string;
  logoUrl?: string;
  mode?: Mode;
  density?: Density;
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

export type UpdateSSODTO = {
  enforceMFA: boolean;
  sso: Sso;
  allowedDomains: string;
};

export type UpdateProfileDTO = {
  name: string;
  email: string;
};
