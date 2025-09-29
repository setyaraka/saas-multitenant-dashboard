import { useEffect, useState } from "react";

import { myTenants, assumeTenantById } from "@/services/auth";
import { useAuth } from "@/store/auth";
import TenantPickerDialog from "@/components/tenant-picker-dialog";

export default function TenantGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tenantId, setTenant } = useAuth();
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<
    { tenantId: string; name?: string; permissions?: string[] }[]
  >([]);
  const [picking, setPicking] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (tenantId) {
        setLoading(false);

        return;
      }
      try {
        const t = await myTenants();

        if (!mounted) return;
        if (t.length === 0) {
          setOpen(false);
          setList([]);
          // optional: arahkan ke halaman info/no-tenant
        } else if (t.length === 1) {
          const a = await assumeTenantById(t[0].tenantId);

          setTenant({
            tenantId: a.tenantId,
            token: a.token,
            permissions: a.permissions ?? t[0].permissions ?? [],
          });
        } else {
          setList(t);
          setOpen(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tenantId, setTenant]);

  async function onPick(id: string) {
    setPicking(id);
    try {
      const a = await assumeTenantById(id);

      setTenant({
        tenantId: a.tenantId,
        token: a.token,
        permissions: a.permissions ?? [],
      });
      setOpen(false);
    } finally {
      setPicking(null);
    }
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">Loading…</div>;

  return (
    <>
      {children}
      <TenantPickerDialog
        open={open}
        pickingId={picking}
        tenants={list}
        onClose={() => setOpen(false)}
        onPick={onPick}
      />
    </>
  );
}
