import { Box, Link as ChakraLink } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import { Footer } from "@/components/Footer"

export function AppLayout() {
  return (
    <Box bg="#FFFDF7" minH="100dvh" display="flex" flexDirection="column">
      <ChakraLink
        href="#main-content"
        position="absolute"
        left="-9999px"
        top="auto"
        width="1px"
        height="1px"
        overflow="hidden"
        zIndex="skipLink"
        _focus={{
          left: "1rem",
          top: "1rem",
          width: "auto",
          height: "auto",
          overflow: "visible",
          px: "4",
          py: "2",
          bg: "#1a1a1a",
          color: "white",
          borderRadius: "sm",
          fontWeight: "bold",
          fontSize: "sm",
        }}
      >
        Skip to main content
      </ChakraLink>

      <Box
        as="main"
        id="main-content"
        flex="1"
        maxW="7xl"
        mx="auto"
        px={{ base: "4", md: "6", lg: "8" }}
        py={{ base: "8", md: "10" }}
        w="full"
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  )
}