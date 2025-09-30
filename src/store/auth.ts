import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Permission = string;
export type Role = "OWNER" | "ADMIN" | "STAFF" | "VIEWER" | (string & {});
export type User = { id: string; email: string; role?: Role };

export type AuthState = {
  userToken?: string;
  tenantToken?: string;
  tenantId?: string;
  user?: User;
  permissions: Permission[];

  setUserToken: (t: string | undefined) => void;
  setTenant: (opts: {
    tenantId: string;
    token?: string;
    permissions?: Permission[];
  }) => void;
  setUser: (u: User | undefined) => void;
  setPermissions: (p: Permission[]) => void;
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
      setPermissions: (p) => set({ permissions: p }),
      reset: () =>
        set({
          userToken: undefined,
          tenantToken: undefined,
          tenantId: undefined,
          user: undefined,
          permissions: [],
        }),
    }),
    { name: "auth" },
  ),
);
