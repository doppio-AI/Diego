import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base "./" mantiene el build portable: funciona en GitHub Pages (subruta),
// Netlify/Vercel (raíz) y también al abrir dist/index.html directamente.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
