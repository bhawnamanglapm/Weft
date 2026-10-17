import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config";

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    // The dashboard page isn't referenced by any manifest key crxjs treats as
    // an HTML entry point. Declaring it as a rollup input is what gets it and
    // its <script>/<link> tags bundled the same way the side panel's
    // index.html is (see the note in manifest.config.ts).
    rollupOptions: {
      input: {
        dashboard: "src/dashboard/index.html",
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
