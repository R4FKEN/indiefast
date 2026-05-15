import { Flex, Button, Box } from "@chakra-ui/react"
import { Tooltip } from "@/components/ui/tooltip"
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
  "11. Grow",
]

const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  "All": "Browse all tools across every stage of the indie hacker journey.",
  "1. Discover": "Spot fresh problems, hot niches, and fast-moving ideas worth chasing. This is where you find the opportunities before everyone else does.",
  "2. Research": "Check the market, size up competitors, and move quickly from guesswork to signal. The goal is to get sharp fast, not stay in research forever.",
  "3. Validate": "Test the idea with real people before you waste weeks building the wrong thing. Fast validation beats expensive guessing every time.",
  "4. Plan": "Turn the idea into a lean roadmap and decide what makes the cut. Keep it tight, simple, and ready to move.",
  "5. Design": "Sketch the UI, shape the experience, and make it feel fast from the first click. Good design should make the product feel obvious, not complicated.",
  "6. Build": "Code the thing, wire it up, and get to a working version as fast as possible. This is where vibe coding, frameworks, and shortcuts earn their keep.",
  "7. Backend": "Handle the plumbing: databases, auth, APIs, and serverless logic. Quiet tools, fast foundations.",
  "8. Ship": "Deploy, launch, and get the thing in front of users without overthinking it. This is the sprint from \"almost done\" to \"live now.\"",
  "9. Monetize": "Add payments, subscriptions, billing, and ways to actually make money. Fast growth is great, but paid is better.",
  "10. Measure": "Track what users do, what breaks, and what converts. Fast feedback helps you improve before momentum slips.",
  "11. Grow": "Push the product further with SEO, automation, integrations, and repeatable systems. This is where speed turns into scale.",
}

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
  "11. Grow": "#98FB98",
}

const LIGHT_CATEGORIES = new Set<Category>([
  "3. Validate",
  "4. Plan",
  "8. Ship",
  "10. Measure",
  "11. Grow",
])

interface FilterBarProps {
  active: Category
  onChange: (cat: Category) => void
  activeSubtopic?: GrowSubtopic | null
  onSubtopicChange?: (sub: GrowSubtopic | null) => void
}

export function FilterBar({ active, onChange, activeSubtopic, onSubtopicChange }: FilterBarProps) {
  const showGrowSubtopics = active === "11. Grow"

  return (
    <Box mb="8">
      <Flex gap="2" pb="4" flexWrap="wrap">
        {CATEGORIES.map((cat) => {
          const isActive = cat === active
          const color = CATEGORY_COLORS[cat]
          const isLight = LIGHT_CATEGORIES.has(cat)
          return (
            <Tooltip
              key={cat}
              content={CATEGORY_DESCRIPTIONS[cat]}
              openDelay={300}
              closeDelay={100}
              positioning={{ placement: "bottom" }}
              contentProps={{
                maxW: "xs",
                fontSize: "xs",
                lineHeight: "moderate",
              }}
            >
              <Button
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
                  if (cat !== "11. Grow" && onSubtopicChange) {
                    onSubtopicChange(null)
                  }
                }}
              >
                {cat}
              </Button>
            </Tooltip>
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
