import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Permission = string;

export type AuthState = {
  userToken?: string;
  tenantToken?: string;
  tenantId?: string;
  user?: { id: string; email: string };
  permissions?: Permission[];

  setUserToken: (t: string | undefined) => void;
  setTenant: (opts: {
    tenantId: string;
    token?: string;
    permissions?: Permission[];
  }) => void;
  setUser: (u: { id: string; email: string } | undefined) => void;
  reset: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      userToken: undefined,
      tenantToken: undefined,
      tenantId: undefined,
      user: undefined,
      permissions: [],

      setUserToken: (t) => set({ userToken: t }),
      setTenant: ({ tenantId, token, permissions }) =>
        set((s) => ({
          tenantId,
          tenantToken: token ?? s.tenantToken,
          permissions: permissions ?? s.permissions,
        })),
      setUser: (u) => set({ user: u }),
      reset: () =>
        set({
          userToken: undefined,
          tenantToken: undefined,
          tenantId: undefined,
          user: undefined,
          permissions: [],
        }),
    }),
    {
      name: "auth-store",
      partialize: (s) => ({
        userToken: s.userToken,
        tenantToken: s.tenantToken,
        tenantId: s.tenantId,
        user: s.user,
        permissions: s.permissions,
      }),
    },
  ),
);
