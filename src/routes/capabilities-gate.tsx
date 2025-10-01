import { Outlet } from "react-router-dom";

import { useAuth } from "@/store/auth";
import {
  useTenantCapabilities,
  useTenantId,
} from "@/components/hooks/use-tenant-setting";

export default function CapabilitiesGate() {
  const userToken = useAuth((s) => s.userToken);
  const tenantToken = useAuth((s) => s.tenantToken);
  const tenantId = useTenantId();

  if (!userToken || !tenantToken || !tenantId) return <Outlet />;

  const { isLoading, isError, refetch } = useTenantCapabilities();

  if (isLoading) {
    return (
      <div className="min-h-[20vh] grid place-items-center text-gray-600">
        Loading access permissions…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[20vh] grid place-items-center text-center p-6">
        <div>
          <div className="text-lg font-medium mb-2">
            Failed to load permissions
          </div>
          <button
            className="px-3 py-2 border rounded"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
