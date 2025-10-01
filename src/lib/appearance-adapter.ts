export type UiMode = "light" | "dark" | "system";
export type UiDensity = "comfortable" | "compact";

export const serverModeToUi = (
  m: "LIGHT" | "DARK" | "SYSTEM" | null | undefined,
): UiMode => (m ? (m.toLowerCase() as UiMode) : "system");

export const uiModeToServer = (m: UiMode): "LIGHT" | "DARK" | "SYSTEM" =>
  m.toUpperCase() as any;

export const serverDensityToUi = (
  d: "COMFORTABLE" | "COMPACT" | null | undefined,
): UiDensity => (d === "COMPACT" ? "compact" : "comfortable");

export const uiDensityToServer = (d: UiDensity): "COMFORTABLE" | "COMPACT" =>
  d === "compact" ? "COMPACT" : "COMFORTABLE";
