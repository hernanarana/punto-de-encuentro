// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Category from "./pages/Category.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminRoutes from "./admin/AdminRoutes.jsx";
import SearchPage from "./pages/SearchPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Inicio */}
        <Route index element={<Home />} />

        {/* Detalle de producto */}
        <Route path="producto/:id" element={<ProductDetail />} />

        {/* Catálogo por categoría (slug libre) */}
        <Route path="categoria/:slug" element={<Category />} />

        {/* Ofertas: render directo del catálogo en modo "ofertas" */}
        <Route
          path="ofertas"
          element={<Category forceOffers={true} defaultMinDiscount={50} />}
        />

        {/* Buscador */}
        <Route path="buscar" element={<SearchPage />} />

        {/* 404 dentro del layout */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Panel de administración */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}
