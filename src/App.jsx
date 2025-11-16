// src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Category from "./pages/Category.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminRoutes from "./admin/AdminRoutes.jsx";
import SearchPage from "./pages/SearchPage.jsx";


import Proximamente from "./pages/Proximamente";


// 🟩 IMPORTANTE: importar la nueva página
import WhatsappOrderPage from "./pages/WhatsappOrderPage.jsx";

/** Solo en mobile, /buscar redirige a / (manteniendo ?q=&...) */
function BuscarRouterGate() {
  const location = useLocation();
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

  if (isMobile) {
    return <Navigate to={{ pathname: "/", search: location.search }} replace />;
  }
  // Desktop renderiza la página de búsqueda normal
  return <SearchPage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="producto/:id" element={<ProductDetail />} />
        <Route path="categoria/:slug" element={<Category />} />
        <Route path="ofertas" element={<Category forceOffers={true} defaultMinDiscount={50} />} />
        <Route path="buscar" element={<BuscarRouterGate />} />

        {/* 🟩 NUEVA RUTA PARA ARMAR PEDIDO POR WHATSAPP */}
        <Route path="pedido-whatsapp" element={<WhatsappOrderPage />} />
<Route path="proximamente" element={<Proximamente />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
}
