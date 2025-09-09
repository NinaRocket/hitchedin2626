import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/",
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": { target: "http://localhost:3000", changeOrigin: true }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main:  resolve(__dirname, "index.html"),
        rsvp:  resolve(__dirname, "rsvp.html"),
        admin: resolve(__dirname, "admin.html")
      }
    }
  }
});
