import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import Inspect from "vite-plugin-inspect"
import { inspectReact } from "./src"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Inspect(), inspectReact(), react()],
  test: {
    environment: "happy-dom",
  },
})
