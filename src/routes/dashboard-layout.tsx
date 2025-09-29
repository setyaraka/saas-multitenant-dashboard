// src/routes/DashboardLayout.tsx
import { Outlet } from "react-router-dom";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar kamu di sini */}
      {/* <aside className="w-64 border-r hidden md:block">…</aside> */}
      <Sidebar />
      <main className="flex-1">
        {/* Navbar kamu di sini */}
        {/* <header className="h-14 border-b px-4 flex items-center">…</header> */}
        <Navbar />
        <section className="p-4 bg-gray-100">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
