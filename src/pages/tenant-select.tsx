import { useNavigate } from "react-router-dom";

import { useAssumeTenant, useMyTenants } from "@/components/hooks/use-auth";

export default function TenantSelectPage() {
  const { data, isLoading, error } = useMyTenants();
  const assume = useAssumeTenant();
  const navigate = useNavigate();

  const onPick = (tenantId: string) => {
    assume.mutate(
      { tenantId },
      { onSuccess: () => navigate("/", { replace: true }) },
    );
  };

  if (isLoading) return <div className="p-6">Memuat daftar tenant…</div>;
  if (error)
    return <div className="p-6 text-red-600">Gagal memuat tenant.</div>;
  if (!data?.length)
    return <div className="p-6">Kamu belum memiliki tenant.</div>;

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Pilih Tenant</h1>
      <div className="grid gap-2">
        {data.map((t) => (
          <button
            key={t.tenantId}
            className="text-left border rounded px-3 py-2 hover:bg-gray-50"
            disabled={assume.isPending}
            onClick={() => onPick(t.tenantId)}
          >
            <div className="font-medium">{t.tenantId}</div>
            <div className="text-sm text-gray-600">{t.role ?? "member"}</div>
          </button>
        ))}
      </div>
      {assume.isPending && (
        <div className="text-sm text-gray-500">Mengatur tenant…</div>
      )}
    </div>
  );
}
