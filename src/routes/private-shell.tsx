import AppBootstrap from "@/components/app-bootstrap";
import { Outlet } from "react-router-dom";

export default function PrivateShell() {
  return (
    <>
      <AppBootstrap />
      <Outlet />
    </>
  );
}
