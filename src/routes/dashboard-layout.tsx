// src/routes/DashboardLayout.tsx
import { Outlet } from "react-router-dom";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1">
        <Navbar />
        <section className="p-4 bg-gray-100 min-h-screen">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
