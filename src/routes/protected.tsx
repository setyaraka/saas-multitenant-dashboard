import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/store/auth";

export default function Protected() {
  const userToken = useAuth((s) => s.userToken);
  if (!userToken) return <Navigate to="/login" replace />;
  return <Outlet />;
}