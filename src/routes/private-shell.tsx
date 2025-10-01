import { Outlet } from "react-router-dom";
import { useEffect } from "react";

import AppThemeBridge from "./app-theme-bridge";

import AppBootstrap from "@/components/app-bootstrap";
import { useTenantSettings } from "@/hooks/use-tenant-setting";
import { applyTenantTheme } from "@/lib/theme-runtime";

export default function PrivateShell() {
  const { data: settings, isLoading } = useTenantSettings();

  useEffect(() => {
    if (!settings) return;
    applyTenantTheme({
      primary: settings.appearance.primaryColor ?? "#0ea5e9",
      accent: settings.appearance.accent ?? "#f59e0b",
    });
  }, [settings]);

  return (
    <>
      {!isLoading && (
        <>
          <AppBootstrap />
          <AppThemeBridge />
          <Outlet />
        </>
      )}
    </>
  );
}
