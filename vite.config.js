import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En Vercel -> "/"; en GitHub Pages -> "/punto-de-encuentro/"
const isVercel = !!process.env.VERCEL;

export default defineConfig({
  base: isVercel ? "/" : "/punto-de-encuentro/",
  plugins: [react()],
});
