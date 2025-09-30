import { PropsWithChildren } from "react";

import { useAuth } from "@/store/auth";

export function useHasPerm(perm: string) {
  const perms = useAuth((s) => s.permissions);

  return perms.includes(perm);
}

export function RequirePerm({
  perm,
  children,
  fallback = null,
}: {
  perm: string;
  fallback?: React.ReactNode;
} & PropsWithChildren) {
  const ok = useHasPerm(perm);

  return <>{ok ? children : fallback}</>;
}
