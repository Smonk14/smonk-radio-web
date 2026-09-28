import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        admin: resolve(import.meta.dirname, "admin/index.html"),
      },

      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "admin") {
            return "assets/admin.js";
          }

          return "assets/smonk-radio.js";
        },

        chunkFileNames: "assets/[name].js",

        assetFileNames: (assetInfo) => {
          const names = assetInfo.names ?? [];

          if (
            names.some((name) =>
              name.includes("admin")
            )
          ) {
            return "assets/admin[extname]";
          }

          if (
            names.some((name) =>
              name.endsWith(".css")
            )
          ) {
            return "assets/smonk-radio[extname]";
          }

          return "assets/[name][extname]";
        },
      },
    },
  },
});