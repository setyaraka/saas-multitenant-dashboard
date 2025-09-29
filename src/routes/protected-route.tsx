import { Navigate, Outlet, useLocation } from "react-router-dom";

import { isAuthenticated } from "@/lib/auth";

export default function ProtectedRoute() {
  const loc = useLocation();

  if (!isAuthenticated()) {
    const next = encodeURIComponent(loc.pathname + loc.search);

    return <Navigate replace to={`/login?next=${next}`} />;
  }

  return <Outlet />;
}
