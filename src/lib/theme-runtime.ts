function chooseForeground(hex: string): "#000000" | "#ffffff" {
  const m = hex.trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);

  if (!m) return "#000000";
  const r = parseInt(m[1], 16),
    g = parseInt(m[2], 16),
    b = parseInt(m[3], 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 140 ? "#000000" : "#ffffff";
}

export function applyTenantTheme(opts: {
  primary?: string | null;
  accent?: string | null;
}) {
  const root = document.documentElement;
  const primary = opts.primary || "#0ea5e9";
  const accent = opts.accent || "#f59e0b";

  root.style.setProperty("--tenant-brand", primary);
  root.style.setProperty("--tenant-accent", accent);

  root.style.setProperty("--color-brand-foreground", chooseForeground(primary));
  root.style.setProperty("--color-accent-foreground", chooseForeground(accent));
}
