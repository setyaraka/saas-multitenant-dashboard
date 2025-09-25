import { Route, Routes } from "react-router-dom";

// import IndexPage from "@/pages/index";
// import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import OverviewPage from "./pages/overview";
import OrdersPage from "./pages/order";

function App() {
  return (
    <Routes>
      <Route element={<OverviewPage />} path="/" />
      <Route element={<OrdersPage />} path="/order" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
