import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import path from "path";
import copy from "rollup-plugin-copy-merge";

export default defineConfig({
  plugins: [
    Vue(),
    Icons({
      compiler: "vue3",
    }),
    copy({
      targets: [
        {
          src: "./node_modules/emoji-mart-vue-fast/data/all.json",
          dest: "./dist/emoji",
        },
      ],
      verbose: true,
    }),
  ],
  define: {
    "process.env": process.env,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: fileURLToPath(new URL("./dist", import.meta.url)),
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, "src/build.ts"),
      name: "SonicComment",
      formats: ["iife"],
      fileName: (format) => `sonic-comment.${format}.js`,
    },
    sourcemap: false,
    rollupOptions: {
      external: ["vue"],
      output: {
        assetFileNames: "sonic-comment.[ext]",
        globals: {
          vue: "Vue",
        },
        exports: "named",
      },
    },
  },
  optimizeDeps: {
    include: ["vue"],
  },
  server: {
    port: 4000,
    proxy: {
      "/actuator": {
        target: "http://localhost:8090",
        changeOrigin: true,
      },
    },
  },
});
