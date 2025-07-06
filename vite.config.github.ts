import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// GitHub Pages specific Vite config
export default defineConfig({
  base: "mystic-nest/", // Change this to your repo name if deploying to username.github.io/repo-name
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
