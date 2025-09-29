import { useMemo, PropsWithChildren } from "react";

import { useAuth } from "@/store/auth";

export function useRequirePerm(perm: string) {
  const { permissions } = useAuth();
  const allowed = useMemo(
    () => !!permissions?.includes(perm),
    [permissions, perm],
  );

  return { allowed };
}

export function RequirePerm({
  perm,
  fallback = null,
  children,
}: PropsWithChildren<{ perm: string; fallback?: JSX.Element | null }>) {
  const { allowed } = useRequirePerm(perm);

  return allowed ? <>{children}</> : (fallback ?? null);
}
