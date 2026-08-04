import { Box, Flex, Grid } from "@chakra-ui/react"
import { useState, useEffect, useCallback } from "react"
import type { Tool, Category, GrowSubtopic } from "@/types"
import { fetchTools } from "@/api"
import { FALLBACK_TOOLS } from "@/mock-data"
import { Header } from "@/components/Header"
import { ToolCardGuide } from "@/components/ToolCardGuide"
import { FilterBar } from "@/components/FilterBar"
import { ToolGrid } from "@/components/ToolGrid"
import { SpeedStack } from "@/components/SpeedStack"
import { Newsletter } from "@/components/Newsletter"

export function HomePage() {
  const [tools, setTools] = useState<Tool[]>(FALLBACK_TOOLS)
  const [loading, setLoading] = useState(!import.meta.env.PROD)
  const [activeCategory, setActiveCategory] = useState<Category>("All")
  const [activeSubtopic, setActiveSubtopic] = useState<GrowSubtopic | null>(null)
  const [stack, setStack] = useState<Tool[]>([])

  useEffect(() => {
    fetchTools()
      .then(setTools)
      .catch((err) => console.error("[indiefa.st]", err.message))
      .finally(() => setLoading(false))
  }, [])

  const toggleStack = useCallback((tool: Tool) => {
    setStack((prev) => {
      const exists = prev.find((t) => t.id === tool.id)
      if (exists) return prev.filter((t) => t.id !== tool.id)
      return [...prev, tool]
    })
  }, [])

  const filteredTools = (activeCategory === "All"
    ? tools
    : tools.filter((t) => t.Category === activeCategory || t.SecondCategory === activeCategory)
  ).filter((t) => !activeSubtopic || t.Subtopic === activeSubtopic)

  const sortedTools = [...filteredTools].sort((a, b) => {
    if (activeCategory === "All") {
      return a.Name.localeCompare(b.Name)
    }
    if (a.Featured && !b.Featured) return -1
    if (!a.Featured && b.Featured) return 1
    return 0
  })

  return (
    <>
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
        gap={{ base: "6", lg: "5" }}
        mb="4"
        alignItems="stretch"
      >
        {/* Intro + phase arrows sit in the left 2/3, beside the tool-card guide */}
        <Flex
          gridColumn={{ lg: "span 2" }}
          direction="column"
          justify="space-between"
          gap={{ base: "5", lg: "6" }}
          minW="0"
        >
          <Header />
          <Box w="full" flexShrink={0} maxW="100%">
            <img
              src="/arrows.png?v=3"
              alt="Click the different phases"
              width={2494}
              height={432}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "contain",
                objectPosition: "left bottom",
              }}
            />
          </Box>
        </Flex>
        <ToolCardGuide />
      </Grid>
      <Box id="tools">
        <FilterBar
          active={activeCategory}
          onChange={setActiveCategory}
          activeSubtopic={activeSubtopic}
          onSubtopicChange={setActiveSubtopic}
        />
      </Box>
      <ToolGrid
        tools={sortedTools}
        loading={loading}
        stack={stack}
        onToggleStack={toggleStack}
      />
      <Box id="newsletter">
        <Newsletter />
      </Box>
      <SpeedStack stack={stack} onRemove={toggleStack} />
    </>
  )
}