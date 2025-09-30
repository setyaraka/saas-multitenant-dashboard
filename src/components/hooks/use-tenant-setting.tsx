import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/store/auth";
import {
  AppearanceDto,
  LocalizationDto,
  DomainDto,
  TenantSettings,
  CapabilitiesResp,
} from "@/types/api";
import { TenantsApi } from "@/services/tenant";
import { queryKey } from "@/lib/keys";

export function useTenantId() {
  return useAuth((s) => s.tenantId);
}

export function useTenantSettings() {
  const tenantId = useTenantId();

  return useQuery({
    enabled: !!tenantId,
    queryKey: tenantId
      ? queryKey.tenantSettings(tenantId)
      : ["tenant", "none", "settings"],
    queryFn: async () => {
      if (!tenantId) throw new Error("No tenant selected");
      const res = await TenantsApi.getSettings(tenantId);
      const settings = (res as any)?.settings ?? (res as any);

      return settings as TenantSettings;
    },
  });
}

export function useTenantCapabilities() {
  const tenantId = useTenantId();
  const setPerms = useAuth((s) => s.setPermissions);

  return useQuery({
    enabled: !!tenantId,
    queryKey: tenantId
      ? queryKey.tenantCapabilities(tenantId)
      : ["tenant", "none", "capabilities"],
    queryFn: async () => {
      if (!tenantId) throw new Error("No tenant selected");
      const caps = await TenantsApi.getCapabilities(tenantId);

      setPerms(caps.permissions);

      return caps as CapabilitiesResp;
    },
  });
}

function optimisticPatch<T extends AppearanceDto | LocalizationDto | DomainDto>(
  updater: (tenantId: string, body: T) => Promise<TenantSettings>,
  keyOfPart: keyof TenantSettings,
) {
  return function usePatch() {
    const tenantId = useTenantId();
    const qc = useQueryClient();

    return useMutation({
      mutationFn: async (body: T) => {
        if (!tenantId) throw new Error("No tenant selected");

        return updater(tenantId, body);
      },
      onMutate: async (body) => {
        if (!tenantId) return;
        const key = queryKey.tenantSettings(tenantId);

        await qc.cancelQueries({ queryKey: key });

        const prev = qc.getQueryData<TenantSettings>(key);

        if (prev) {
          qc.setQueryData<TenantSettings>(key, {
            ...prev,
            [keyOfPart]: { ...(prev as any)[keyOfPart], ...body },
          });
        }

        return { prev, key };
      },
      onError: (_err, _vars, ctx) => {
        if (ctx?.prev && ctx?.key) {
          qc.setQueryData(ctx.key, ctx.prev);
        }
      },
      onSettled: async () => {
        if (!tenantId) return;
        await qc.invalidateQueries({
          queryKey: queryKey.tenantSettings(tenantId),
        });
      },
    });
  };
}

export const useUpdateAppearance = optimisticPatch<AppearanceDto>(
  TenantsApi.updateAppearance,
  "appearance",
);

export const useUpdateLocalization = optimisticPatch<LocalizationDto>(
  TenantsApi.updateLocalization,
  "localization",
);

export const useUpdateDomain = optimisticPatch<DomainDto>(
  TenantsApi.updateDomain,
  "domain",
);

export function useUploadLogo() {
  const tenantId = useTenantId();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!tenantId) throw new Error("No tenant selected");
      if (!file.type.startsWith("image/"))
        throw new Error("Hanya file gambar yang diperbolehkan");
      if (file.size > 2 * 1024 * 1024) throw new Error("Ukuran maksimum 2MB");

      return TenantsApi.uploadLogo(tenantId, file);
    },
    onSuccess: async () => {
      if (!tenantId) return;
      await qc.invalidateQueries({
        queryKey: queryKey.tenantSettings(tenantId),
      });
    },
  });
}
