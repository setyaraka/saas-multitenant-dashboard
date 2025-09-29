import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/store/auth";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userToken } = useAuth();
  const loc = useLocation();

  if (!userToken) return <Navigate replace state={{ from: loc }} to="/login" />;

  return <>{children}</>;
}
