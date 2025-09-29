import { useEffect, useState } from "react";

import { myTenants, assumeTenantById } from "@/services/auth";
import { useAuth } from "@/store/auth";
import TenantPickerDialog from "@/components/tenant-picker-dialog";

export default function AppGate({ children }: { children: React.ReactNode }) {
  const { tenantId, setTenant } = useAuth();
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [pick, setPick] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!tenantId) {
        const t = await myTenants();

        if (t.length <= 1) {
          if (t[0]) {
            const assumed = await assumeTenantById(t[0].tenantId);

            setTenant({
              tenantId: assumed.tenantId,
              token: assumed.token,
              permissions: assumed.permissions ?? [],
            });
          }
        } else {
          setList(t);
          setOpen(true);
        }
      }
    })();
  }, [tenantId, setTenant]);

  async function onPick(tenantId: string) {
    setPick(tenantId);
    const assumed = await assumeTenantById(tenantId);

    setTenant({
      tenantId: assumed.tenantId,
      token: assumed.token,
      permissions: assumed.permissions ?? [],
    });
    setOpen(false);
    setPick(null);
  }

  return (
    <>
      {children}
      <TenantPickerDialog
        open={open}
        pickingId={pick}
        tenants={list}
        onClose={() => setOpen(false)}
        onPick={onPick}
      />
    </>
  );
}
