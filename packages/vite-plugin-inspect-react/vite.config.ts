import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import Inspect from "vite-plugin-inspect"
import { inspectReact } from "./src"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspect(),
    inspectReact({
      formatDataInspectId(id) {
        return id.substring(__dirname.length + 1)
      },
    }),
    react(),
  ],
  test: {
    environment: "happy-dom",
    globals: true,
  },
  server: {
    open: true,
  },
})
