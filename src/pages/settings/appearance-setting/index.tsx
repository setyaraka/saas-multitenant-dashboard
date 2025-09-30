import { useState, useEffect } from "react";

import { RequirePerm } from "@/lib/rbac";
import {
  useTenantCapabilities,
  useTenantSettings,
  useUpdateAppearance,
} from "@/components/hooks/use-tenant-setting";

export default function SettingsAppearancePage() {
  const { data: settings, isLoading } = useTenantSettings();

  useTenantCapabilities();

  const mutateAppearance = useUpdateAppearance();

  const [primary, setPrimary] = useState("#3b82f6");
  const [font, setFont] = useState("Inter");
  const [density, setDensity] = useState<"compact" | "comfortable">(
    "comfortable",
  );
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setPrimary(settings.appearance?.primaryColor ?? "#3b82f6");
    setFont(settings.appearance?.fontFamily ?? "Inter");
    setDensity((settings.appearance?.density as any) ?? "comfortable");
    setDirty(false);
  }, [settings]);

  if (isLoading) return <div className="p-4">Loading settings…</div>;
  if (!settings) return <div className="p-4">Tidak ada data settings.</div>;

  const onSave = () => {
    mutateAppearance.mutate(
      { primaryColor: primary, fontFamily: font, density },
      { onSuccess: () => setDirty(false) },
    );
  };

  return (
    <div className="max-w-xl p-4 space-y-3">
      <h1 className="text-xl font-semibold">Appearance</h1>

      <label className="block">
        <span className="text-sm">Primary Color</span>
        <input
          className="block w-24 h-10 border rounded"
          type="color"
          value={primary}
          onChange={(e) => {
            setPrimary(e.target.value);
            setDirty(true);
          }}
        />
      </label>

      <label className="block">
        <span className="text-sm">Font Family</span>
        <input
          className="border p-2 w-full"
          placeholder="Inter / Sora / IBM Plex Sans"
          value={font}
          onChange={(e) => {
            setFont(e.target.value);
            setDirty(true);
          }}
        />
      </label>

      <label className="block">
        <span className="text-sm">Density</span>
        <select
          className="border p-2 w-full"
          value={density}
          onChange={(e) => {
            setDensity(e.target.value as any);
            setDirty(true);
          }}
        >
          <option value="comfortable">Comfortable</option>
          <option value="compact">Compact</option>
        </select>
      </label>

      <RequirePerm
        fallback={
          <div className="text-amber-600 text-sm">
            Kamu tidak punya izin menyimpan perubahan.
          </div>
        }
        perm="USERS_MANAGE"
      >
        <div className="sticky bottom-4 bg-white/80 backdrop-blur border p-3 rounded shadow flex items-center justify-between">
          <div className="text-sm">
            {dirty ? "Perubahan belum disimpan" : "Tidak ada perubahan"}
          </div>
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={!dirty || mutateAppearance.isPending}
            onClick={onSave}
          >
            {mutateAppearance.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </RequirePerm>
    </div>
  );
}
