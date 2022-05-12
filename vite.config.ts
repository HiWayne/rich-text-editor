import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { posix } from "path";

const resolve = (relativePath: string) =>
  posix.join(posix.resolve("./"), relativePath);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      // Set it to `true` to export React component as default.
      // Notice that it will overrides the default behavior of Vite.
      exportAsDefault: true,

      // svgr options: https://react-svgr.com/docs/options/
      svgrOptions: {
        // ...
      },

      // esbuild options, to transform jsx to js
      esbuildOptions: {
        // ...
      },
    }),
  ],
  resolve: {
    alias: {
      assets: resolve("src/assets"),
      store: resolve("src/store"),
      components: resolve("src/components"),
    },
  },
});
