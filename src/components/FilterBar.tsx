import { Flex, Button, Box, Icon, Grid, Text } from "@chakra-ui/react"
import { LuArrowRight } from "react-icons/lu"
import { Tooltip } from "@/components/ui/tooltip"
import type { Category, GrowSubtopic } from "../types"
import { CATEGORY_COLORS, GROW_SUBTOPICS } from "../constants"
import { SITE_COPY } from "@/constants/site-copy"

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
  "11. Grow": "Run parallel growth functions — automate, scale, build community, support users, improve SEO, and expand distribution. No fixed order; pick what you need now.",
}

const GROW_COLOR = CATEGORY_COLORS["11. Grow"]

function categoryButtonTextColor(cat: Category, onCategoryColor: boolean): string {
  if (!onCategoryColor) return "#1a1a1a"
  if (cat === "All") return "white"
  return "#1a1a1a"
}

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
      <Grid
        templateColumns={{
          base: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
          lg: "repeat(6, minmax(0, 1fr))",
          xl: "repeat(12, minmax(0, 1fr))",
        }}
        gap="2"
        pb="4"
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat === active
          const color = CATEGORY_COLORS[cat]
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
                width="100%"
                bg={isActive ? color : "white"}
                color={categoryButtonTextColor(cat, isActive)}
                border="2px solid"
                borderColor="#1a1a1a"
                borderRadius="sm"
                fontWeight="bold"
                fontSize="xs"
                px="4"
                boxShadow={isActive ? "2px 2px 0px #1a1a1a" : "none"}
                _hover={{
                  bg: color,
                  color: categoryButtonTextColor(cat, true),
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
                {cat === "All" ? (
                  <Flex as="span" alignItems="center" gap="1">
                    <Box as="span">All: A</Box>
                    <Icon boxSize="3">
                      <LuArrowRight />
                    </Icon>
                    <Box as="span">Z</Box>
                  </Flex>
                ) : (
                  cat
                )}
              </Button>
            </Tooltip>
          )
        })}
      </Grid>
      {showGrowSubtopics && (
        <Box pt="2" pl="2" borderLeft="3px solid" borderColor="#98FB98">
          <Text fontSize="xs" color="#555" mb="2" fontWeight="medium">
            {SITE_COPY.growSubtopicsHint}
          </Text>
          <Flex gap="2" flexWrap="wrap" alignItems="center">
          <Box
            fontSize="xs"
            fontWeight="bold"
            color="#2d8a2d"
            bg="#d4ffd4"
            px="2"
            py="0.5"
            borderRadius="sm"
            lineHeight="tall"
          >
            Grow
          </Box>
          <Button
            size="xs"
            variant="outline"
            bg={activeSubtopic === null ? GROW_COLOR : "white"}
            color="#1a1a1a"
            border="2px solid"
            borderColor="#1a1a1a"
            borderRadius="sm"
            fontWeight="semibold"
            fontSize="xs"
            px="3"
            boxShadow={activeSubtopic === null ? "2px 2px 0px #1a1a1a" : "none"}
            _hover={{
              bg: GROW_COLOR,
              transform: "translate(-1px, -1px)",
              boxShadow: "3px 3px 0px #1a1a1a",
            }}
            transition="all 0.1s"
            onClick={() => {
              if (onSubtopicChange) {
                onSubtopicChange(null)
              }
            }}
          >
            All
          </Button>
          {GROW_SUBTOPICS.map((sub) => {
            const isActive = activeSubtopic === sub
            return (
              <Button
                key={sub}
                size="xs"
                variant="outline"
                bg={isActive ? GROW_COLOR : "white"}
                color="#1a1a1a"
                border="2px solid"
                borderColor="#1a1a1a"
                borderRadius="sm"
                fontWeight="semibold"
                fontSize="xs"
                px="3"
                boxShadow={isActive ? "2px 2px 0px #1a1a1a" : "none"}
                _hover={{
                  bg: GROW_COLOR,
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
        </Box>
      )}
    </Box>
  )
}
