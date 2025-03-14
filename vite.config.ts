import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import extensionReloader from "./vite-extension-reloader";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    extensionReloader({
      browserType: "chrome",
      extensionId: "",
      reloadOnHmr: true,
    }),
  ],
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.svg"],
  server: {
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
    open: false,
  },
});
