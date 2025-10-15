import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useMe } from "./use-auth";

import { useAuth } from "@/store/auth";
import { TenantsApi } from "@/services/tenant";
import { applyTenantTheme } from "@/lib/theme-runtime";
import {
  UpdateAppearanceDto,
  UpdateLocalizationDto,
  UpdateDomainDto,
  SettingsResp,
  UpdateIntegrationDto,
  UpdateSSODTO,
  UpdateProfileDTO,
} from "@/services/dto/tenant-dto";

const queryKey = {
  settings: (id: string) => ["settings", id] as const,
  capabilities: (id: string) => ["capabilities", id] as const,
};

export function useTenantId() {
  return useAuth((s) => s.tenantId)!;
}

export function useTenantSettings() {
  const tenantId = useTenantId();

  return useQuery({
    queryKey: queryKey.settings(tenantId),
    queryFn: () => TenantsApi.getSettings(tenantId),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useUpdateAppearance() {
  const qc = useQueryClient();
  const tenantId = useTenantId();

  return useMutation({
    mutationFn: (body: UpdateAppearanceDto) =>
      TenantsApi.updateAppearance(tenantId, body),
    onMutate: async (body) => {
      await qc.cancelQueries({ queryKey: queryKey.settings(tenantId) });

      const prev = qc.getQueryData<SettingsResp>(queryKey.settings(tenantId));

      // hitung nilai “next” untuk warna (body > cache > default)
      const nextPrimary =
        body.primaryColor ?? prev?.appearance.primaryColor ?? "#0ea5e9";
      const nextAccent = body.accent ?? prev?.appearance.accent ?? "#f59e0b";

      // apply warna segera
      applyTenantTheme({ primary: nextPrimary, accent: nextAccent });

      // update cache appearance secara optimistik (kalau cache ada)
      if (prev) {
        qc.setQueryData<SettingsResp>(queryKey.settings(tenantId), {
          ...prev,
          appearance: {
            ...prev.appearance,
            brandName: body.brandName ?? prev.appearance.brandName ?? null,
            primaryColor: nextPrimary,
            accent: nextAccent,
            logoUrl: body.logoUrl ?? prev.appearance.logoUrl ?? null,
            mode: body.mode ?? prev.appearance.mode ?? null,
            density: body.density ?? prev.appearance.density ?? null,
            fontFamily: body.fontFamily ?? prev.appearance.fontFamily ?? null,
          },
        });
      }

      return { prev };
    },
    onSuccess: (data) => {
      if ((data as SettingsResp).appearance) {
        const s = data as SettingsResp;

        qc.setQueryData(queryKey.settings(tenantId), s);
        applyTenantTheme({
          primary: s.appearance.primaryColor ?? "#0ea5e9",
          accent: s.appearance.accent ?? "#f59e0b",
        });
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKey.settings(tenantId) });
    },
  });
}
export function useUpdateLocalization() {
  const qc = useQueryClient();
  const tenantId = useTenantId();

  return useMutation({
    mutationFn: (body: UpdateLocalizationDto) =>
      TenantsApi.updateLocalization(tenantId, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKey.settings(tenantId) }),
  });
}
export function useUpdateDomain() {
  const qc = useQueryClient();
  const tenantId = useTenantId();

  return useMutation({
    mutationFn: (body: UpdateDomainDto) =>
      TenantsApi.updateDomain(tenantId, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKey.settings(tenantId) }),
  });
}
export function useUploadLogo() {
  const qc = useQueryClient();
  const tenantId = useTenantId();

  return useMutation({
    mutationFn: (file: File) => TenantsApi.uploadLogo(tenantId, file),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKey.settings(tenantId) }),
  });
}
export function useUpdateIntegration() {
  const qc = useQueryClient();
  const tenantId = useTenantId();

  return useMutation({
    mutationFn: (body: UpdateIntegrationDto) =>
      TenantsApi.updateIntegration(tenantId, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKey.settings(tenantId) }),
  });
}
export function useUpdateSSO() {
  const qc = useQueryClient();
  const tenantId = useTenantId();

  return useMutation({
    mutationFn: (body: UpdateSSODTO) => TenantsApi.updateSso(tenantId, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKey.settings(tenantId) }),
  });
}
export function useUpdateProfile() {
  const qc = useQueryClient();

  const { data: me } = useMe();
  const userId = me?.userId ?? "";

  return useMutation({
    mutationFn: (body: UpdateProfileDTO) =>
      TenantsApi.updateProfile(userId, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKey.settings(userId) }),
  });
}
export function useTenantCapabilities() {
  const tenantId = useTenantId();
  const setPermissions = useAuth((s) => s.setPermissions);

  const q = useQuery({
    queryKey: queryKey.capabilities(tenantId),
    queryFn: () => TenantsApi.getCapabilities(tenantId),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!q.data) return;
    const perms = q.data.permissions ?? q.data.permissions ?? [];

    setPermissions(perms);
  }, [q.data, setPermissions]);

  useEffect(() => {
    return () => setPermissions([]);
  }, [tenantId, setPermissions]);

  return q;
}
