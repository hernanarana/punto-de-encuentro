// src/pages/admin/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      nav("/admin");
    } catch (e) {
      setErr(e.message || "Error al iniciar sesión");
    }
  }

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <form onSubmit={onSubmit} style={{ width: 320, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <h3>Ingresar al panel</h3>
        <label>Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{ width: "100%" }} />
        </label>
        <label>Contraseña
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{ width: "100%" }} />
        </label>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        <button type="submit" style={{ marginTop: 10 }}>Entrar</button>
      </form>
    </div>
  );
}
