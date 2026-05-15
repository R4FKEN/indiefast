import { Grid, Box, Text } from "@chakra-ui/react"
import type { Tool } from "../types"
import { ToolCard } from "./ToolCard"

interface ToolGridProps {
  tools: Tool[]
  loading: boolean
  stack: Tool[]
  onToggleStack: (tool: Tool) => void
}

export function ToolGrid({ tools, loading, stack, onToggleStack }: ToolGridProps) {
  if (loading) {
    return (
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        gap="5"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Box
            key={i}
            h="220px"
            border="2px solid"
            borderColor="#1a1a1a"
            borderRadius="sm"
            bg="white"
            boxShadow="4px 4px 0px #1a1a1a"
            animation="pulse 2s infinite"
          />
        ))}
      </Grid>
    )
  }

  if (tools.length === 0) {
    return (
      <Box py="16" textAlign="center">
        <Text color="#888" fontSize="md" fontWeight="medium">
          No tools found in this category.
        </Text>
      </Box>
    )
  }

  return (
    <Grid
      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
      gap="5"
    >
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          inStack={stack.some((t) => t.id === tool.id)}
          onToggleStack={onToggleStack}
        />
      ))}
    </Grid>
  )
}
