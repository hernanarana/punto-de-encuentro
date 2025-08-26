// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isGH = process.env.GITHUB_ACTIONS === "true";
const repo = "punto-de-encuentro";

export default defineConfig({
  plugins: [react()],
  base: isGH ? `/${repo}/` : "/",
  server: { host: true, port: 5173 },
});
