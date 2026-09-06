import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import { Box, Text } from "@chakra-ui/react"
import { AppLayout } from "@/components/AppLayout"

const HomePage = lazy(() =>
  import("@/pages/HomePage").then((m) => ({ default: m.HomePage })),
)
const BlogPage = lazy(() =>
  import("@/pages/BlogPage").then((m) => ({ default: m.BlogPage })),
)
const BlogPostPage = lazy(() =>
  import("@/pages/BlogPostPage").then((m) => ({ default: m.BlogPostPage })),
)

function RouteFallback() {
  return (
    <Box
      minH="40vh"
      bg="#FFFDF7"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py="16"
    >
      <Text fontSize="sm" color="#666" fontWeight="medium">
        Loading…
      </Text>
    </Box>
  )
}

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/*" element={<BlogPostPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
