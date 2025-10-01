import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AuthApi } from "@/services/auth";
import { useAuth } from "@/store/auth";
import { queryKey } from "@/lib/keys";
import { setLastUsedTenant } from "@/lib/tenant-resolver";

export function useMe() {
  return useQuery({
    queryKey: queryKey.me,
    queryFn: async () => {
      const me = await AuthApi.me();

      useAuth
        .getState()
        .setUser({ id: me.userId, email: me.email, role: me.role as any });

      return me;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useMyTenants() {
  return useQuery({
    queryKey: queryKey.myTenants,
    queryFn: () => AuthApi.myTenants(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  const setUserToken = useAuth((s) => s.setUserToken);

  return useMutation({
    mutationFn: AuthApi.login,
    onSuccess: async (res) => {
      setUserToken(res.access_token);
      await Promise.all([
        qc.invalidateQueries({ queryKey: queryKey.me }),
        qc.invalidateQueries({ queryKey: queryKey.myTenants }),
      ]);
    },
  });
}

export function useAssumeTenant() {
  const qc = useQueryClient();
  const setTenant = useAuth((s) => s.setTenant);

  return useMutation({
    mutationFn: AuthApi.assumeTenantById,
    onSuccess: async (res, variables) => {
      setTenant({ tenantId: variables.tenantId, token: res.access_token });
      setLastUsedTenant(variables.tenantId);
      await Promise.all([qc.invalidateQueries()]);
    },
  });
}
