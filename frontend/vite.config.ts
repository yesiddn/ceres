import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL ?? "http://localhost:5170",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("error", (err) => console.error("[Vite Proxy Error]", err));
        },
      },
    },
  },
});
