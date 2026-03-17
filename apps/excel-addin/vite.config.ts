import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3100,
    https: {
      // Office Add-ins require HTTPS for development
      // Generate dev certs: npx office-addin-dev-certs install
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
