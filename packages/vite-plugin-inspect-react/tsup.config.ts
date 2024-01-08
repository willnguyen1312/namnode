import { defineConfig } from "tsup"

export default defineConfig({
  clean: true,
  format: ["esm", "cjs"],
  external: [],
  treeshake: true,
  minify: true,
  dts: true,
})
