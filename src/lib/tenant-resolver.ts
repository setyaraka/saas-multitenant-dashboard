export type TenantHintSource = "subdomain" | "path" | "query" | "lastUsed";

export function getTenantFromSubdomain(hostname: string): string | undefined {
  const parts = hostname.split(".");

  if (parts.length < 2) return undefined;
  const sub = parts[0];

  if (!sub || sub === "www") return undefined;

  return sub;
}

export function getTenantFromPath(pathname: string): string | undefined {
  const m = pathname.match(/^\/t\/([^\/?#]+)/);

  return m?.[1];
}

export function getTenantFromQuery(search: string): string | undefined {
  const p = new URLSearchParams(search);

  return p.get("tenant") ?? undefined;
}

export function getLastUsedTenant(): string | undefined {
  try {
    return localStorage.getItem("lastTenantId") ?? undefined;
  } catch {
    return undefined;
  }
}

export function setLastUsedTenant(id: string) {
  try {
    localStorage.setItem("lastTenantId", id);
  } catch {}
}

export function resolveHintsFromLocation(loc: Location) {
  const list: Array<{ id: string; source: TenantHintSource }> = [];
  const sub = getTenantFromSubdomain(loc.hostname);
  const path = getTenantFromPath(loc.pathname);
  const query = getTenantFromQuery(loc.search);
  const last = getLastUsedTenant();

  if (sub) list.push({ id: sub, source: "subdomain" });
  if (path) list.push({ id: path, source: "path" });
  if (query) list.push({ id: query, source: "query" });
  if (last) list.push({ id: last, source: "lastUsed" });

  return list;
}
