import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api":  { target: "http://localhost:3000", changeOrigin: true },
    //   "/rsvp": { target: "http://localhost:3000", changeOrigin: true },
    //   "/admin":{ target: "http://localhost:3000", changeOrigin: true }
    }
  },
  base: "/"
});
