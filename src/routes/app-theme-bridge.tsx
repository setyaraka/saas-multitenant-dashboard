import { useEffect } from "react";

import { applyTenantTheme } from "@/lib/theme-runtime";
import { useTenantSettings } from "@/hooks/use-tenant-setting";

export default function AppThemeBridge() {
  const { data } = useTenantSettings();

  useEffect(() => {
    if (!data) return;
    applyTenantTheme({
      primary: data.appearance?.primaryColor ?? "#0ea5e9",
      accent: data.appearance?.accent ?? "#f59e0b",
    });
  }, [data]);

  return null;
}
