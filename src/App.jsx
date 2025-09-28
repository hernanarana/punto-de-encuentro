// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Category from "./pages/Category.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminRoutes from "./admin/AdminRoutes.jsx";

// 🔎 Buscador independiente
import SearchPage from "./pages/SearchPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="producto/:id" element={<ProductDetail />} />

        {/* Catálogo por categoría */}
        <Route path="categoria/:slug" element={<Category />} />

        {/* 🔎 Buscador */}
        <Route path="buscar" element={<SearchPage />} />

        {/* ✅ Atajo: /ofertas → /categoria/ofertas?minDiscount=50 */}
        <Route
          path="ofertas"
          element={<Navigate to="/categoria/ofertas?minDiscount=50" replace />}
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Árbol admin */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}
