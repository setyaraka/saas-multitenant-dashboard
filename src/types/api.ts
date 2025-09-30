export type LoginBody = { email: string; password: string };
export type LoginResp = { access_token: string } & Record<string, any>;

export type MeResp = { userId: string; email: string; role?: string };
export type MyTenant = { tenantId: string; tenantKey?: string; role?: string };
export type MyTenantsResp = MyTenant[];

export type AssumeTenantByIdBody = { tenantId: string };
export type AssumeTenantResp = { access_token: string };

export type AppearanceDto = {
  primaryColor?: string;
  fontFamily?: string;
  density?: "compact" | "comfortable";
};

export type LocalizationDto = {
  locale?: string; // "id-ID", "en-SG", etc.
  currency?: "IDR" | "USD" | "SGD" | string;
};

export type DomainDto = {
  domain?: string; // "app.mydomain.com"
};

export type TenantSettings = {
  tenantId: string;
  appearance?: AppearanceDto;
  localization?: LocalizationDto;
  domain?: DomainDto;
  logoUrl?: string | null;
};

export type CapabilitiesResp = {
  role: string;
  permissions: string[];
};
