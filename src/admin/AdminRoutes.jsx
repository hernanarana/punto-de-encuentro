import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "./AdminLayout";
import AdminLogin from "./AdminLogin";
import Dashboard from "./pages/Dashboard";
import ProductNew from "./pages/ProductNew";
import ProductEditor from "./ProductEditor";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* RUTA RELATIVA: /admin/login */}
      <Route path="login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products/new" element={<ProductNew />} />
        <Route path="producto/:id" element={<ProductEditor />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}
