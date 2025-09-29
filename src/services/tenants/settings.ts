import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { get, patch } from "@/lib/api";

export type TenantSettings = {
  tenantId: string;
  appearance: {
    primaryColor?: string;
    logoUrl?: string;
  };
  localization?: {
    currency?: "IDR" | "SGD" | "USD";
    locale?: string;
  };
  domain?: { customDomain?: string };
};

export type UpdateAppearanceDto = Partial<TenantSettings["appearance"]>;
export type UpdateLocalizationDto = Partial<TenantSettings["localization"]>;
export type UpdateDomainDto = Partial<TenantSettings["domain"]>;

export const getSettings = (tenantId: string) =>
  get<{ tenantId: string; settings: TenantSettings }>(
    `tenants/${tenantId}/settings`,
  );

export function useTenantSettingsQuery(tenantId?: string) {
  return useQuery({
    queryKey: ["tenants", tenantId, "settings"],
    queryFn: () => getSettings(tenantId!),
    enabled: !!tenantId,
  });
}

// Single entry point to update per section:
type Section =
  | { kind: "appearance"; dto: UpdateAppearanceDto }
  | { kind: "localization"; dto: UpdateLocalizationDto }
  | { kind: "domain"; dto: UpdateDomainDto };

export function useUpdateTenantSettingsMutation(tenantId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (s: Section) => {
      switch (s.kind) {
        case "appearance":
          return patch<TenantSettings>(
            `tenants/${tenantId}/settings/appearance`,
            s.dto,
          );
        case "localization":
          return patch<TenantSettings>(
            `tenants/${tenantId}/settings/localization`,
            s.dto,
          );
        case "domain":
          return patch<TenantSettings>(
            `tenants/${tenantId}/settings/domain`,
            s.dto,
          );
      }
    },
    onMutate: async (s) => {
      const key = ["tenants", tenantId, "settings"];

      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<{
        tenantId: string;
        settings: TenantSettings;
      }>(key);

      // optimistic patch (hindari undefined → jangan timpa)
      if (prev) {
        const next: typeof prev = JSON.parse(JSON.stringify(prev));

        if (s.kind === "appearance") {
          next.settings.appearance = { ...next.settings.appearance, ...s.dto };
        } else if (s.kind === "localization") {
          next.settings.localization = {
            ...next.settings.localization,
            ...s.dto,
          };
        } else if (s.kind === "domain") {
          next.settings.domain = { ...next.settings.domain, ...s.dto };
        }
        qc.setQueryData(key, next);
      }

      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(["tenants", tenantId, "settings"], ctx.prev);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tenants", tenantId, "settings"] });
    },
  });
}
