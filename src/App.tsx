// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/login";
import OverviewPage from "./pages/overview";
import OrdersPage from "./pages/order";
import MenuPage from "./pages/menu";
import UsersPage from "./pages/user";
import RolesPage from "./pages/role";
import CategoriesPage from "./pages/categories";
import ModifiersPage from "./pages/modifiers";
import SettingsPage from "./pages/settings";
import AnalyticsPage from "./pages/analytics";
import AuditLogPage from "./pages/audit-log";
import RequireAuth from "./routes/require-auth";
import TenantGate from "./routes/tenant-gate";
import DashboardLayout from "./routes/dashboard-layout";
import AboutPage from "@/pages/about";
import BlogPage from "@/pages/blog";

export default function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />

      <Route
        element={
          <RequireAuth>
            <TenantGate>
              <DashboardLayout />
            </TenantGate>
          </RequireAuth>
        }
        path="/"
      >
        <Route index element={<OverviewPage />} />
        <Route element={<OrdersPage />} path="orders" />
        <Route element={<MenuPage />} path="menu" />
        <Route element={<AnalyticsPage />} path="analytics" />
        <Route element={<CategoriesPage />} path="catalog/categories" />
        <Route element={<ModifiersPage />} path="catalog/modifier" />
        <Route element={<BlogPage />} path="operations/kitchen-display" />
        <Route element={<AboutPage />} path="operations/shift" />
        <Route element={<UsersPage />} path="users-and-role/users" />
        <Route element={<RolesPage />} path="users-and-role/role" />
        <Route element={<SettingsPage />} path="settings" />
        <Route element={<AuditLogPage />} path="audit-log" />
      </Route>

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
