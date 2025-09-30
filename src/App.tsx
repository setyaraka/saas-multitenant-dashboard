import { Route, Routes } from "react-router-dom";

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

import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import Protected from "./routes/protected";

function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<Protected />}>
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
    </Routes>
  );
}

export default App;
