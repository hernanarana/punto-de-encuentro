// src/admin/AdminLogin.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function AdminLogin() {
  const { login, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      // 1) Autenticación
      const cred = await login(email, password);

      // 2) Chequeo de admin (settings/roles.adminEmails)
      const snap = await getDoc(doc(db, "settings", "roles"));
      const admins = snap.exists() ? (snap.data().adminEmails || []) : [];
      const isAdmin = admins.includes(cred.user.email);

      if (!isAdmin) {
        await logout();
        setErr("Este usuario no tiene permisos de administrador.");
        return;
      }

      // 3) Navegar al panel
      const to = location.state?.from?.pathname || "/admin";
      nav(to, { replace: true });
    } catch (e) {
      setErr("Login inválido. Verificá email/clave.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b1220",
        padding: 16,
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: 420,
          width: "100%",
          margin: "0 auto",
          background: "rgba(17,24,39,.9)",
          color: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,.35)",
        }}
      >
        {/* Branding */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <img
            src="/logo-pe.png" // archivo en /public
            alt="Punto de Encuentro"
            width={72}
            height={72}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
              background: "#fff",
              padding: 6,
              boxShadow: "0 2px 12px rgba(0,0,0,.25)",
            }}
          />
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            Acceso Admin
          </h2>
        </div>

        <form onSubmit={onSubmit}>
          <label style={{ display: "grid", gap: 6, marginBottom: 12 }}>
            <span>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              style={{
                padding: 10,
                borderRadius: 8,
                border: "1px solid #374151",
                background: "#0f172a",
                color: "#fff",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6, marginBottom: 12 }}>
            <span>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                padding: 10,
                borderRadius: 8,
                border: "1px solid #374151",
                background: "#0f172a",
                color: "#fff",
              }}
            />
          </label>

          {err && (
            <div
              className="error"
              style={{
                marginTop: 8,
                marginBottom: 8,
                color: "#fca5a5",
                fontSize: 14,
              }}
            >
              {err}
            </div>
          )}

          <button
            className="btn"
            disabled={busy}
            style={{
              width: "100%",
              padding: 12,
              border: 0,
              borderRadius: 8,
              background: busy ? "#1f2937" : "#0ea5e9",
              color: "#fff",
              fontWeight: 700,
              cursor: busy ? "not-allowed" : "pointer",
            }}
          >
            {busy ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
