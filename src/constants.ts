import type { Category, GrowSubtopic } from "./types"

export const CATEGORY_COLORS: Record<Category, string> = {
  "All": "#1a1a1a",
  "1. Discover": "#FF6B6B",
  "2. Research": "#FF8C42",
  "3. Validate": "#FFE66D",
  "4. Plan": "#95E1D3",
  "5. Design": "#4ECDC4",
  "6. Build": "#45B7D1",
  "7. Backend": "#74B9FF",
  "8. Ship": "#A8E6CF",
  "9. Monetize": "#FF8ED4",
  "10. Measure": "#DDA0DD",
  "11. Grow": "#98FB98",
}

export const LIGHT_CATEGORIES = new Set<Category>([
  "3. Validate",
  "4. Plan",
  "8. Ship",
  "10. Measure",
  "11. Grow",
])

export const GROW_SUBTOPICS: GrowSubtopic[] = [
  "Automate",
  "Scale",
  "Community",
  "Support",
  "SEO",
  "Distribution",
]

export const TOOL_CARD_HEIGHT = {
  base: "292px",
  md: "252px",
  lg: "260px",
} as const
