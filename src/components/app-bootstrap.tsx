// components/app-bootstrap.tsx
import { useEffect } from "react";

import {
  useTenantCapabilities,
  useTenantSettings,
} from "../hooks/use-tenant-setting";

import { useAuth } from "@/store/auth";
import { applyTenantTheme } from "@/lib/theme-runtime";

export default function AppBootstrap() {
  const tenantToken = useAuth((s) => s.tenantToken);

  const { refetch: refetchCaps } = useTenantCapabilities();

  useEffect(() => {
    if (tenantToken) refetchCaps();
  }, [tenantToken, refetchCaps]);

  const { data: settings } = useTenantSettings();

  useEffect(() => {
    if (!settings) return;
    const primary = settings.appearance.primaryColor ?? "#0ea5e9";
    const accent = settings.appearance.accent ?? "#f59e0b";

    applyTenantTheme({ primary, accent });

    try {
      localStorage.setItem(
        "tenant-theme",
        JSON.stringify({
          primary,
          accent,
        }),
      );
    } catch {}
  }, [settings]);

  return null;
}
