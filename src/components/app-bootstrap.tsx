import { useEffect } from "react";

import { useTenantCapabilities } from "./hooks/use-tenant-setting";

import { useAuth } from "@/store/auth";

export default function AppBootstrap() {
  const tenantToken = useAuth((s) => s.tenantToken);
  const { refetch } = useTenantCapabilities();

  useEffect(() => {
    if (tenantToken) refetch();
  }, [tenantToken, refetch]);

  return null;
}
