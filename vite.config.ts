import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import { componentTagger } from "lovable-tagger";

// The dev server has no directory-index resolution, so a clean URL like
// "/gannet-os/" hits the SPA fallback and renders NotFound instead of the
// static page. The preview server and Vercel both resolve it to index.html.
const publicDirIndexFallback = (): Plugin => ({
  name: "public-dir-index-fallback",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const pathname = (req.url ?? "").split("?")[0];

      if (pathname && pathname !== "/" && !path.extname(pathname)) {
        const cleanPath = pathname.replace(/\/$/, "");
        const indexFile = path.join(server.config.publicDir, cleanPath, "index.html");

        if (fs.existsSync(indexFile)) {
          req.url = `${cleanPath}/index.html`;
        }
      }

      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    publicDirIndexFallback(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
