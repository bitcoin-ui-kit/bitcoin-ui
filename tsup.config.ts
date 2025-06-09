import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  external: ["react", "react-dom", "qrcode.react"],
  banner: {
    js: "use client;",
  },
  esbuildOptions(options) {
    options.jsx = "automatic"
  },
})
