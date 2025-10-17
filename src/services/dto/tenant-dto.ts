export type Mode = "LIGHT" | "DARK" | "SYSTEM";

export type Density = "COMFORTABLE" | "COMPACT";

export type Status = "not_verified" | "verifying" | "active" | "failed";

export type Sso = "disabled" | "saml" | "oidc-google" | "oidc-microsoft";

export type FontSize = "small" | "normal" | "large";

export type RetentionValues = 7 | 30 | 60 | 90 | 180 | 365;

export interface UserSetting {
  email: string;
  name: string;
};

export interface Apperance {
  brandName: string | null;
  primaryColor: string | null;
  accent: string | null;
  logoUrl: string | null;
  mode: Mode | null;
  density: Density | null;
  fontFamily: string | null;
};

export interface Localization {
  locale: string | null;
  currency: string | null;
  timezone: string | null;
};

export interface Domain {
  domain: string | null;
  status: Status;
  autoHttps?: boolean;
  verifiedAt?: string | null;
};

export interface SettingsResp {
  appearance: Apperance;
  localization: Localization;
  domain: Domain | null;
  logoUrl: string | null;
  integration: UpdateIntegrationDto;
  users: UserSetting;
};

export interface UpdateAppearanceDto {
  brandName?: string;
  primaryColor?: string;
  accent?: string;
  logoUrl?: string;
  mode?: Mode;
  density?: Density;
  fontFamily?: string;
};

export interface UpdateLocalizationDto {
  language?: string;
  currency?: string;
  timezone?: string;
};

export interface UpdateDomainDto {
  domain?: string;
  autoHttps?: boolean;
};

export interface UpdateIntegrationDto {
  slackEnabled?: boolean;
  zapierEnabled?: boolean;
  webhookUrl?: string;
};

export interface UpdateSSODTO {
  enforceMFA: boolean;
  sso: Sso;
  allowedDomains: string;
};

export interface UpdateProfileDTO {
  name: string;
  email: string;
};

export interface UpdateNotificationsDTO {
  orderCreatedEmail: boolean;
  invoiceIssueEmail: boolean;
}

export interface UpdateAccessibilityDTO {
  reduceMotion: boolean;
  fontSize: FontSize;
}

export interface UpdateComplianceDTO {
  retentionDays: RetentionValues
}

export interface UpdateApiDTO {
  publicKey: string;
  secretKey: string;
}