import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiTarget = process.env.VITE_API_PROXY || "http://127.0.0.1:3001";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // 127.0.0.1 avoids Node/Vite proxy AggregateError when localhost resolves to ::1 first
      "/api": {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
