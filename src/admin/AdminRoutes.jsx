// src/admin/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "./AdminLayout";
import AdminLogin from "./AdminLogin";

import Products from "./pages/Products.jsx";
import Dashboard from "./pages/Dashboard";
import ProductNew from "./pages/ProductNew";
import ProductEditor from "./ProductEditor";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* /admin/login */}
      <Route path="login" element={<AdminLogin />} />

      {/* /admin/* (protegido) */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Home: lista de productos (con miniaturas) */}
        <Route index element={<Products />} />

        {/* Dashboard opcional */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Crear producto — soporta ambos paths */}
        <Route path="products/new" element={<ProductNew />} />
        <Route path="nuevo" element={<ProductNew />} />

        {/* Editar producto — soporta ambos paths */}
        <Route path="producto/:id" element={<ProductEditor />} />
        <Route path="editar/:id" element={<ProductEditor />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}
