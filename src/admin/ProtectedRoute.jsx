import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import useIsAdmin from "./useIsAdmin";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { isAdmin, loading: loadingAdmin } = useIsAdmin();
  const location = useLocation();

  if (loading || loadingAdmin) return null; // evita parpadeo

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return children;
}
