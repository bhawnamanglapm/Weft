import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Weft",
  version: "0.0.1",
  description: "Records real work, reconstructs the true workflow, and finds where automation belongs. Runs entirely locally.",
  permissions: ["storage", "sidePanel"],
  icons: {
    16: "icons/icon-16.png",
    32: "icons/icon-32.png",
    48: "icons/icon-48.png",
    128: "icons/icon-128.png",
  },
  action: {
    default_icon: {
      16: "icons/icon-16.png",
      32: "icons/icon-32.png",
      48: "icons/icon-48.png",
      128: "icons/icon-128.png",
    },
    default_title: "Open Weft",
  },
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  side_panel: {
    default_path: "src/sidepanel/index.html",
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/capture.ts"],
      run_at: "document_idle",
    },
  ],
  // The Process Intelligence dashboard (src/dashboard/index.html) is a
  // full-tab extension page opened from the side panel. It is deliberately
  // NOT a web_accessible_resource: the extension can open its own pages
  // without that, and listing it would let any website detect that Weft is
  // installed or load the dashboard in a frame. vite.config.ts bundles it.
});
