import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  globalCss: {
    body: {
      bg: "#FFFDF7",
      color: "#1a1a1a",
      fontFamily: "'Inter', system-ui, sans-serif",
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#f0fdf4" },
          100: { value: "#dcfce7" },
          200: { value: "#bbf7d0" },
          300: { value: "#86efac" },
          400: { value: "#4ade80" },
          500: { value: "#16a34a" },
          600: { value: "#15803d" },
          700: { value: "#166534" },
          800: { value: "#14532d" },
          900: { value: "#052e16" },
          950: { value: "#022c22" },
        },
        accent: {
          50: { value: "#fef3c7" },
          100: { value: "#fde68a" },
          200: { value: "#fcd34d" },
          300: { value: "#fbbf24" },
          400: { value: "#f59e0b" },
          500: { value: "#d97706" },
          600: { value: "#b45309" },
          700: { value: "#92400e" },
          800: { value: "#78350f" },
          900: { value: "#451a03" },
          950: { value: "#27150a" },
        },
        pop: {
          coral: { value: "#FF6B6B" },
          blue: { value: "#4ECDC4" },
          yellow: { value: "#FFE66D" },
          pink: { value: "#FF8ED4" },
          lavender: { value: "#C3B1E1" },
          mint: { value: "#95E1D3" },
        },
      },
      fonts: {
        heading: { value: "'Inter', system-ui, sans-serif" },
        body: { value: "'Inter', system-ui, sans-serif" },
        mono: { value: "'JetBrains Mono', 'SF Mono', monospace" },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "#FFFFFF" },
          fg: { value: "{colors.brand.600}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.50}" },
          emphasized: { value: "{colors.brand.400}" },
          focusRing: { value: "{colors.brand.500}" },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
