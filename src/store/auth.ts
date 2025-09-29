import { create } from "zustand";

type AuthState = {
  userToken: string | null;
  tenantToken: string | null;
  tenantId: string | null;
  setUserToken: (t: string | null) => void;
  assumeTenant: (tenantId: string, token: string) => void;
  clear: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  userToken: null,
  tenantToken: null,
  tenantId: null,
  setUserToken: (t) => set({ userToken: t }),
  assumeTenant: (tenantId, token) => set({ tenantId, tenantToken: token }),
  clear: () => set({ userToken: null, tenantToken: null, tenantId: null }),
}));
