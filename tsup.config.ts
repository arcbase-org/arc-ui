import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom", /^next(\/.*)?$/],
  // I componenti usano hook e stato: vanno caricati lato client (Next.js App Router)
  banner: { js: '"use client"' },
})
