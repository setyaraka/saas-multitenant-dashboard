import { Route, Routes } from "react-router-dom";

import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import OverviewPage from "./pages/overview";
import OrdersPage from "./pages/order";
import MenuPage from "./pages/menu";

function App() {
  return (
    <Routes>
      <Route element={<OverviewPage />} path="/" />
      <Route element={<OrdersPage />} path="/orders" />
      <Route element={<MenuPage />} path="/menu" />
      <Route element={<BlogPage />} path="/analytics" />
      <Route element={<AboutPage />} path="/catalog/categories" />
      <Route element={<PricingPage />} path="/catalog/modifier" />
      <Route element={<BlogPage />} path="/operations/kitchen-display" />
      <Route element={<AboutPage />} path="/operations/shift" />
      <Route element={<AboutPage />} path="/users-and-role/users" />
      <Route element={<PricingPage />} path="/users-and-role/role" />
      <Route element={<BlogPage />} path="settings" />
      <Route element={<AboutPage />} path="audit-log" />
    </Routes>
  );
}

export default App;
