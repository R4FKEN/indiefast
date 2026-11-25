import { Grid, Box, Text } from "@chakra-ui/react"
import type { Tool } from "../types"
import { TOOL_CARD_HEIGHT } from "../constants"
import { ToolCard } from "./ToolCard"
import { RankFastCard, SponsorCard } from "./SponsorCard"

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
            h={TOOL_CARD_HEIGHT}
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

  return (
    <Box position="relative">
      <Box
        position="absolute"
        top="0"
        left="calc(50% - 50vw + 32px)"
        w="240px"
        display="none"
        flexDirection="column"
        gap="5"
        css={{
          "@media (min-width: 1800px)": {
            display: "flex",
          },
        }}
      >
        <RankFastCard
          inStack={stack.some((tool) => tool.id === "rankfast")}
          onToggleStack={onToggleStack}
        />
        <SponsorCard />
      </Box>

      <Box
        position="absolute"
        top="0"
        right="calc(50% - 50vw + 32px)"
        w="240px"
        display="none"
        flexDirection="column"
        gap="5"
        css={{
          "@media (min-width: 1800px)": {
            display: "flex",
          },
        }}
      >
        <SponsorCard />
        <SponsorCard />
      </Box>

      {tools.length === 0 ? (
        <Box py="16" textAlign="center">
          <Text color="#888" fontSize="md" fontWeight="medium">
            No tools found in this category.
          </Text>
        </Box>
      ) : (
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
      )}

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}
        gap="5"
        mt="5"
        css={{
          "@media (min-width: 1800px)": {
            display: "none",
          },
        }}
      >
        <RankFastCard
          inStack={stack.some((tool) => tool.id === "rankfast")}
          onToggleStack={onToggleStack}
        />
        <SponsorCard />
        <SponsorCard />
        <SponsorCard />
      </Grid>
    </Box>
  )
}
