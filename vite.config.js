// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vercel setea VERCEL=1 durante el build
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

// ⚠️ cambiá "punto-de-encuentro" si tu repo se llama distinto
const GH_BASE = "/punto-de-encuentro/";

export default defineConfig({
  base: isVercel ? "/" : GH_BASE,
  plugins: [react()],
});
