export type SectionKey =
  | "appearance"
  | "domain"
  | "billing"
  | "integrations"
  | "sso"
  | "roles"
  | "localization"
  | "compliance"
  | "api"
  | "profile"
  | "notifications"
  | "accessibility";

export type LocaleValues = {
  language: "id-ID" | "en-US" | "en-GB";
  timezone:
    | "Asia/Jakarta"
    | "Asia/Makassar"
    | "Asia/Jayapura"
    | "UTC"
    | "Asia/Singapore";
  currency: "IDR" | "USD" | "EUR" | "SGD";
};
