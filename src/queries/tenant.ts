import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/store/auth";
import { api } from "@/lib/api";

export function useSettings() {
  const tenantId = useAuth((s) => s.tenantId);

  return useQuery({
    queryKey: ["settings", tenantId],
    queryFn: () => api.get(`/tenants/${tenantId}/settings`, true),
    enabled: !!tenantId,
  });
}

export function useCapabilities() {
  const tenantId = useAuth((s) => s.tenantId);

  return useQuery({
    queryKey: ["capabilities", tenantId],
    queryFn: () => api.get(`/tenants/${tenantId}/capabilities`, true),
    enabled: !!tenantId,
  });
}

export function useUpdateAppearance() {
  const qc = useQueryClient();
  const tenantId = useAuth((s) => s.tenantId);

  return useMutation({
    mutationFn: (dto: any) =>
      api.json(`/tenants/${tenantId}/settings/appearance`, "PATCH", dto, true),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", tenantId] });
    },
  });
}

export function useUploadLogo() {
  const qc = useQueryClient();
  const tenantId = useAuth((s) => s.tenantId);

  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();

      form.append("file", file);

      return api.form(`/tenants/${tenantId}/brand/logo`, form);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", tenantId] }),
  });
}
