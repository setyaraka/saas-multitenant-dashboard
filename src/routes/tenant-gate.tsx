import { Outlet } from "react-router-dom";
import { useRef, useEffect } from "react";

import { useAuth } from "@/store/auth";
import { useAssumeTenant, useMyTenants } from "@/components/hooks/use-auth";

export default function TenantGate() {
  const userToken = useAuth((s) => s.userToken);
  const tenantToken = useAuth((s) => s.tenantToken);

  if (!userToken) return <Outlet />;

  if (tenantToken) return <Outlet />;

  return <ResolveTenant />;
}

function ResolveTenant() {
  const { data, isLoading, isError, refetch } = useMyTenants();
  const assume = useAssumeTenant();
  const autoAssumeOnce = useRef(false);

  useEffect(() => {
    if (autoAssumeOnce.current) return;
    if (!data || isLoading || isError) return;

    if (data.length === 1) {
      autoAssumeOnce.current = true;
      assume.mutate({ tenantId: data[0].tenantId });
    }
  }, [data, isLoading, isError, assume]);

  if (isLoading || assume.isPending) {
    return (
      <div className="min-h-[40vh] grid place-items-center text-gray-600">
        Menentukan tenant aktif…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[40vh] grid place-items-center text-center p-6">
        <div>
          <div className="text-lg font-medium mb-2">
            Gagal memuat daftar tenant
          </div>
          <button
            className="px-3 py-2 border rounded"
            onClick={() => refetch()}
          >
            Coba Ulang
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-[40vh] grid place-items-center text-center p-6">
        <div>
          <div className="text-lg font-medium mb-2">
            Akunmu belum memiliki tenant
          </div>
          <p className="text-sm text-gray-600">
            Hubungi admin untuk ditambahkan ke sebuah tenant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Pilih Tenant</h1>
      <div className="grid gap-2">
        {data.map((t) => (
          <button
            key={t.tenantId}
            className="text-left border rounded px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
            disabled={assume.isPending}
            onClick={() => assume.mutate({ tenantId: t.tenantId })}
          >
            <div className="font-medium break-all">{t.tenantId}</div>
            <div className="text-sm text-gray-600">{t.role ?? "member"}</div>
          </button>
        ))}
      </div>
      {assume.isError && (
        <div className="text-sm text-red-600">
          Gagal mengatur tenant. Coba pilih lagi.
        </div>
      )}
    </div>
  );
}
