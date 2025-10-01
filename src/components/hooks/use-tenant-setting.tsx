import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/store/auth";
import {
  TenantsApi,
  UpdateAppearanceDto,
  UpdateLocalizationDto,
  UpdateDomainDto,
} from "@/services/tenant";

const key = {
  settings: (id: string) => ["settings", id] as const,
};

export function useTenantId() {
  return useAuth((s) => s.tenantId)!;
}

export function useTenantSettings() {
  const tenantId = useTenantId();

  return useQuery({
    queryKey: key.settings(tenantId),
    queryFn: () => TenantsApi.getSettings(tenantId),
    enabled: !!tenantId,
  });
}

export function useUpdateAppearance() {
  const qc = useQueryClient();
  const tenantId = useTenantId();

  return useMutation({
    mutationFn: (body: UpdateAppearanceDto) =>
      TenantsApi.updateAppearance(tenantId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: key.settings(tenantId) }),
  });
}
export function useUpdateLocalization() {
  const qc = useQueryClient();
  const tenantId = useTenantId();

  return useMutation({
    mutationFn: (body: UpdateLocalizationDto) =>
      TenantsApi.updateLocalization(tenantId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: key.settings(tenantId) }),
  });
}
export function useUpdateDomain() {
  const qc = useQueryClient();
  const tenantId = useTenantId();

  return useMutation({
    mutationFn: (body: UpdateDomainDto) =>
      TenantsApi.updateDomain(tenantId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: key.settings(tenantId) }),
  });
}
export function useUploadLogo() {
  const qc = useQueryClient();
  const tenantId = useTenantId();

  return useMutation({
    mutationFn: (file: File) => TenantsApi.uploadLogo(tenantId, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: key.settings(tenantId) }),
  });
}
