import { Flex, Button } from "@chakra-ui/react"
import type { Category } from "../types"

const CATEGORIES: Category[] = [
  "All",
  "Starter Kits",
  "Rapid UI",
  "Plug-and-Play Backend",
  "Instant Payments",
  "AI Code Gen",
  "Growth Engines",
]

const CATEGORY_COLORS: Record<Category, string> = {
  "All": "#1a1a1a",
  "Starter Kits": "#FF6B6B",
  "Rapid UI": "#4ECDC4",
  "Plug-and-Play Backend": "#FFE66D",
  "Instant Payments": "#FF8ED4",
  "AI Code Gen": "#C3B1E1",
  "Growth Engines": "#95E1D3",
}

interface FilterBarProps {
  active: Category
  onChange: (cat: Category) => void
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <Flex
      gap="2"
      mb="8"
      flexWrap="wrap"
      pb="4"
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat === active
        const color = CATEGORY_COLORS[cat]
        return (
          <Button
            key={cat}
            size="sm"
            variant="outline"
            bg={isActive ? color : "white"}
            color={isActive ? (cat === "Plug-and-Play Backend" || cat === "Growth Engines" ? "#1a1a1a" : cat === "All" ? "white" : "#1a1a1a") : "#1a1a1a"}
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
            onClick={() => onChange(cat)}
          >
            {cat}
          </Button>
        )
      })}
    </Flex>
  )
}
