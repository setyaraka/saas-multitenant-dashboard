import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAssumeTenant } from "./use-auth";

import { AuthApi } from "@/services/auth";
import { useAuth } from "@/store/auth";
import {
  resolveHintsFromLocation,
  setLastUsedTenant,
} from "@/lib/tenant-resolver";

type Status = "idle" | "resolving" | "ready" | "failed" | "skipped";

export function useTenantBootstrap() {
  const { userToken, tenantToken } = useAuth.getState();
  const assume = useAssumeTenant();
  const [status, setStatus] = useState<Status>("idle");
  const [reason, setReason] = useState<string | null>(null);
  const triedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken || tenantToken) {
      setStatus("skipped");

      return;
    }
    if (triedRef.current) return;
    triedRef.current = true;

    (async () => {
      setStatus("resolving");

      const hints = resolveHintsFromLocation(window.location);

      for (const h of hints) {
        const ok = await new Promise<boolean>((resolve) => {
          assume.mutate(
            { tenantId: h.id },
            {
              onSuccess: () => {
                setLastUsedTenant(h.id);
                resolve(true);
              },
              onError: () => resolve(false),
            },
          );
        });

        if (ok) {
          setStatus("ready");

          return;
        }
      }

      let memberships: Array<{ tenantId: string; role?: string }> = [];

      try {
        memberships = await AuthApi.myTenants();
      } catch {
        setReason("Gagal memuat daftar tenant");
        setStatus("failed");

        return;
      }

      if (memberships.length === 0) {
        setReason("User tidak memiliki tenant");
        setStatus("failed");

        return;
      }

      if (memberships.length === 1) {
        const only = memberships[0].tenantId;
        const ok = await new Promise<boolean>((resolve) => {
          assume.mutate(
            { tenantId: only },
            {
              onSuccess: () => {
                setLastUsedTenant(only);
                resolve(true);
              },
              onError: () => resolve(false),
            },
          );
        });

        setStatus(ok ? "ready" : "failed");
        if (!ok) setReason("Assume tenant tunggal gagal");

        return;
      }

      setStatus("failed");
      setReason("Perlu memilih tenant");
      navigate("/tenant-select", { replace: true });
    })();
  }, [userToken, tenantToken]);

  return { status, reason, assuming: assume.isPending };
}
