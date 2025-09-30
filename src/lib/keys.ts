export const queryKey = {
  me: ["me"] as const,
  myTenants: ["me", "tenants"] as const,
  tenant: (tenantId: string) => ["tenant", tenantId] as const,
  tenantSettings: (tenantId: string) =>
    ["tenant", tenantId, "settings"] as const,
  tenantCapabilities: (tenantId: string) =>
    ["tenant", tenantId, "capabilities"] as const,
};
