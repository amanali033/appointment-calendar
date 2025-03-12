import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __APP_BASE_URL__: JSON.stringify(env.VITE_APP_BASE_URL),
      __APP_BASE_URL_AUTH__: JSON.stringify(env.VITE_APP_BASE_URL_AUTH),
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/auth-api": {
          target: env.VITE_APP_BASE_URL_AUTH,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth-api/, ""),
        },
      },
    },
  };
});
