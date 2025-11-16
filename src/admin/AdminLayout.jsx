// src/admin/AdminLayout.jsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useEffect } from "react";               // ⬅️ agregado

export default function AdminLayout(){
  const { logout } = useAuth();
  const nav = useNavigate();

  // ⬅️ Agregado: marcar <body> en modo admin para ocultar footer/FAB solo aquí
  useEffect(() => {
    document.body.classList.add("admin-mode");
    return () => document.body.classList.remove("admin-mode");
  }, []);

  async function onLogout(){
    await logout();
    nav("/admin/login", { replace: true });
  }

  return (
    <div style={{maxWidth:1000, margin:"24px auto"}}>
      <header style={{display:"flex", gap:12, alignItems:"center", marginBottom:16}}>
        <h1 style={{margin:0, fontSize:22}}>Panel</h1>
        <Link to="/admin" className="btn">Productos</Link>
        <Link to="/admin/products/new" className="btn">+ Nuevo producto</Link>
        <div style={{flex:1}} />
        <button className="btn btn--ghost" onClick={onLogout}>Salir</button>
      </header>
      <Outlet />
    </div>
  );
}
