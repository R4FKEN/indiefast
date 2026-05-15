import { Flex, Button, Box } from "@chakra-ui/react"
import type { Category, GrowSubtopic } from "../types"

const CATEGORIES: Category[] = [
  "All",
  "1. Discover",
  "2. Research",
  "3. Validate",
  "4. Plan",
  "5. Design",
  "6. Build",
  "7. Backend",
  "8. Ship",
  "9. Monetize",
  "10. Measure",
  "11. Launch",
  "12. Grow",
]

const GROW_SUBTOPICS: GrowSubtopic[] = [
  "Retain",
  "Automate",
  "Scale",
  "Community",
  "Support",
  "SEO",
  "Distribution",
]

const CATEGORY_COLORS: Record<Category, string> = {
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
  "11. Launch": "#F0E68C",
  "12. Grow": "#98FB98",
}

interface FilterBarProps {
  active: Category
  onChange: (cat: Category) => void
  activeSubtopic?: GrowSubtopic | null
  onSubtopicChange?: (sub: GrowSubtopic | null) => void
}

export function FilterBar({ active, onChange, activeSubtopic, onSubtopicChange }: FilterBarProps) {
  const showGrowSubtopics = active === "12. Grow"

  return (
    <Box mb="8">
      <Flex
        gap="2"
        pb="4"
        flexWrap="wrap"
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat === active
          const color = CATEGORY_COLORS[cat]
          const isLight = cat === "3. Validate" || cat === "4. Plan" || cat === "8. Ship" || cat === "11. Launch" || cat === "12. Grow" || cat === "10. Measure"
          return (
            <Button
              key={cat}
              size="sm"
              variant="outline"
              bg={isActive ? color : "white"}
              color={isActive ? (isLight ? "#1a1a1a" : cat === "All" ? "white" : "#1a1a1a") : "#1a1a1a"}
              border="2px solid"
              borderColor="#1a1a1a"
              borderRadius="sm"
              fontWeight="bold"
              fontSize="xs"
              px="4"
              boxShadow={isActive ? "2px 2px 0px #1a1a1a" : "none"}
              _hover={{
                bg: isActive ? color : "gray.50",
                transform: "translate(-1px, -1px)",
                boxShadow: "3px 3px 0px #1a1a1a",
              }}
              transition="all 0.1s"
              onClick={() => {
                onChange(cat)
                if (cat !== "12. Grow" && onSubtopicChange) {
                  onSubtopicChange(null)
                }
              }}
            >
              {cat}
            </Button>
          )
        })}
      </Flex>
      {showGrowSubtopics && (
        <Flex gap="2" flexWrap="wrap" pt="1" pl="2" borderLeft="3px solid" borderColor="#98FB98">
          {GROW_SUBTOPICS.map((sub) => {
            const isActive = activeSubtopic === sub
            return (
              <Button
                key={sub}
                size="xs"
                variant="outline"
                bg={isActive ? "#98FB98" : "white"}
                color="#1a1a1a"
                border="2px solid"
                borderColor="#1a1a1a"
                borderRadius="sm"
                fontWeight="semibold"
                fontSize="xs"
                px="3"
                boxShadow={isActive ? "2px 2px 0px #1a1a1a" : "none"}
                _hover={{
                  bg: isActive ? "#98FB98" : "gray.50",
                  transform: "translate(-1px, -1px)",
                  boxShadow: "3px 3px 0px #1a1a1a",
                }}
                transition="all 0.1s"
                onClick={() => {
                  if (onSubtopicChange) {
                    onSubtopicChange(isActive ? null : sub)
                  }
                }}
              >
                {sub}
              </Button>
            )
          })}
        </Flex>
      )}
    </Box>
  )
}
