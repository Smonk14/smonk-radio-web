import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/smonk-radio.js",
        chunkFileNames: "assets/[name].js",

        assetFileNames: (assetInfo) => {
          if (
            assetInfo.names?.some((name) =>
              name.endsWith(".css")
            )
          ) {
            return "assets/smonk-radio.css";
          }

          return "assets/[name][extname]";
        },
      },
    },
  },
});