import { Box } from "@chakra-ui/react"
import { useState, useEffect, useCallback } from "react"
import type { Tool, Category, GrowSubtopic } from "./types"
import { fetchTools } from "./api"
import { FALLBACK_TOOLS } from "./mock-data"
import { Header } from "./components/Header"
import { FilterBar } from "./components/FilterBar"
import { ToolGrid } from "./components/ToolGrid"
import { SpeedStack } from "./components/SpeedStack"
import { Newsletter } from "./components/Newsletter"
import { Footer } from "./components/Footer"

function App() {
  const [tools, setTools] = useState<Tool[]>(() =>
    import.meta.env.PROD ? FALLBACK_TOOLS : []
  )
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
    <Box bg="#FFFDF7" minH="100dvh">
      <Box maxW="7xl" mx="auto" px={{ base: "4", md: "6", lg: "8" }} py="10">
        <Header />
        <FilterBar
          active={activeCategory}
          onChange={setActiveCategory}
          activeSubtopic={activeSubtopic}
          onSubtopicChange={setActiveSubtopic}
        />
        <ToolGrid
          tools={sortedTools}
          loading={loading}
          stack={stack}
          onToggleStack={toggleStack}
        />
        <Newsletter />
        <Footer />
      </Box>
      <SpeedStack stack={stack} onRemove={toggleStack} />
    </Box>
  )
}

export default App
