// src/components/settings/SettingsForm.tsx
// import { Input, Button, Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import { Skeleton } from "@heroui/skeleton";
import { useMemo, useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";

import { useAuth } from "@/store/auth";
import {
  useTenantSettingsQuery,
  useUpdateTenantSettingsMutation,
} from "@/services/tenants/settings";

export default function SettingsForm() {
  const { tenantId } = useAuth();
  const { data, isLoading, isError, error, refetch } =
    useTenantSettingsQuery(tenantId);
  const m = useUpdateTenantSettingsMutation(tenantId!);

  const initial = data?.settings?.appearance;
  const [primaryColor, setPrimaryColor] = useState(initial?.primaryColor ?? "");
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl ?? "");

  useEffect(() => {
    setPrimaryColor(initial?.primaryColor ?? "");
    setLogoUrl(initial?.logoUrl ?? "");
  }, [initial?.primaryColor, initial?.logoUrl]);

  const dirty = useMemo(
    () =>
      primaryColor !== (initial?.primaryColor ?? "") ||
      logoUrl !== (initial?.logoUrl ?? ""),
    [primaryColor, logoUrl, initial],
  );

  if (!tenantId) return <div>Pilih tenant terlebih dahulu.</div>;
  if (isLoading) {
    return (
      <Card>
        <CardHeader>Tenant Settings</CardHeader>
        <CardBody>
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-10 w-full" />
        </CardBody>
      </Card>
    );
  }
  if (isError) {
    const msg = (error as any)?.message ?? "Gagal memuat data.";

    return (
      <Card>
        <CardHeader>Tenant Settings</CardHeader>
        <CardBody>
          <div className="text-danger-500 mb-3">{msg}</div>
          <Button onPress={() => refetch()}>Retry</Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>Tenant Settings</CardHeader>
      <CardBody className="space-y-4">
        <Input
          label="Primary Color"
          placeholder="#3b82f6"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        />
        <Input
          label="Logo URL"
          placeholder="/uploads/tenants/alpha/logo.png"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
        />

        {/* Save Bar */}
        {dirty && (
          <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-[420px] bg-white shadow-lg rounded-2xl p-3 border">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-gray-600">
                Perubahan belum disimpan
              </div>
              <div className="flex gap-2">
                <Button
                  variant="flat"
                  onPress={() => {
                    setPrimaryColor(initial?.primaryColor ?? "");
                    setLogoUrl(initial?.logoUrl ?? "");
                  }}
                >
                  Reset
                </Button>
                <Button
                  color="primary"
                  isLoading={m.isPending}
                  onPress={() =>
                    m.mutate({
                      kind: "appearance",
                      dto: { primaryColor, logoUrl },
                    })
                  }
                >
                  Save
                </Button>
              </div>
            </div>
            {m.isError && (
              <div className="text-danger-500 text-sm mt-2">
                {(m.error as any)?.message ?? "Gagal menyimpan perubahan."}
              </div>
            )}
            {m.isSuccess && (
              <div className="text-success-600 text-sm mt-2">Tersimpan.</div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
