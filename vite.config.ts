import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

const DEV_HOST = "127.0.0.1"
const DEV_PORT = 5173
const API_PORT = 3002
const API_TARGET = `http://127.0.0.1:${API_PORT}`

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    // pdf-vendor (~jspdf) is dynamically imported on export only; keep warning threshold above that chunk
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return
          // Order matters: @chakra-ui/react paths contain "/react/" and must not hit react-vendor
          if (
            id.includes("@chakra-ui") ||
            id.includes("@emotion") ||
            id.includes("next-themes")
          ) {
            return "chakra-vendor"
          }
          if (
            id.includes("react-markdown") ||
            id.includes("remark-gfm") ||
            id.includes("node_modules/remark") ||
            id.includes("node_modules\\remark") ||
            id.includes("node_modules/mdast") ||
            id.includes("node_modules\\mdast") ||
            id.includes("node_modules/micromark") ||
            id.includes("node_modules\\micromark") ||
            id.includes("node_modules/unist") ||
            id.includes("node_modules\\unist") ||
            id.includes("node_modules/hast") ||
            id.includes("node_modules\\hast")
          ) {
            return "markdown-vendor"
          }
          if (
            id.includes("jspdf") ||
            id.includes("html2canvas") ||
            id.includes("dompurify") ||
            id.includes("canvg") ||
            id.includes("fflate")
          ) {
            return "pdf-vendor"
          }
          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules\\react-dom") ||
            id.includes("node_modules/react-router") ||
            id.includes("node_modules\\react-router") ||
            id.includes("node_modules/react/") ||
            id.includes("node_modules\\react\\") ||
            id.includes("node_modules/scheduler") ||
            id.includes("node_modules\\scheduler")
          ) {
            return "react-vendor"
          }
        },
      },
    },
  },
  server: {
    host: DEV_HOST,
    port: DEV_PORT,
    strictPort: true,
    open: false,
    hmr: {
      host: DEV_HOST,
      port: DEV_PORT,
    },
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: DEV_HOST,
    port: 4173,
    strictPort: true,
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
})
