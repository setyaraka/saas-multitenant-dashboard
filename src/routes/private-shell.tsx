import { Outlet } from "react-router-dom";

import AppBootstrap from "@/components/app-bootstrap";

export default function PrivateShell() {
  return (
    <>
      <AppBootstrap />
      <Outlet />
    </>
  );
}
