import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": "http://localhost:5080",
      "/uploads": "http://localhost:5080",
      "/swagger": "http://localhost:5080",
    },
  },
});
