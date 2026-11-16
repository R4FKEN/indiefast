import { lazy, Suspense, useMemo } from "react"
import { useRoutes, type RouteObject } from "react-router-dom"
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
  const routes = useMemo<RouteObject[]>(() => {
    const children: RouteObject[] = [
      { index: true, element: <HomePage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "blog/*", element: <BlogPostPage /> },
    ]
    // Inside the dev check so production builds drop this import. An object
    // route, not a JSX <Route> child: Vite's JSX transform strips those.
    if (import.meta.env.DEV) {
      const AdminPage = lazy(() =>
        import("@/pages/AdminPage").then((m) => ({ default: m.AdminPage })),
      )
      children.push({ path: "admin", element: <AdminPage /> })
    }
    return [{ element: <AppLayout />, children }]
  }, [])

  return <Suspense fallback={<RouteFallback />}>{useRoutes(routes)}</Suspense>
}

export default App
