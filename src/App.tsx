import { Navigate, Route, Routes } from "react-router-dom";

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
import LoginPage from "./pages/login";
import Protected from "./routes/protected";
import TenantSelectPage from "./pages/tenant-select";
import TenantGate from "./routes/tenant-gate";

import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";

function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<Protected />}>
        <Route element={<TenantGate />}>
          <Route element={<OverviewPage />} path="/" />
          <Route element={<OverviewPage />} path="/" />
          <Route element={<OrdersPage />} path="/orders" />
          <Route element={<MenuPage />} path="/menu" />
          <Route element={<AnalyticsPage />} path="/analytics" />
          <Route element={<CategoriesPage />} path="/catalog/categories" />
          <Route element={<ModifiersPage />} path="/catalog/modifier" />
          <Route element={<BlogPage />} path="/operations/kitchen-display" />
          <Route element={<AboutPage />} path="/operations/shift" />
          <Route element={<UsersPage />} path="/users-and-role/users" />
          <Route element={<RolesPage />} path="/users-and-role/role" />
          <Route element={<SettingsPage />} path="settings" />
          <Route element={<AuditLogPage />} path="audit-log" />
        </Route>
        <Route element={<TenantSelectPage />} path="/tenant-select" />
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}

export default App;
