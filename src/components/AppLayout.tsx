import { Box } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import { Footer } from "@/components/Footer"

export function AppLayout() {
  return (
    <Box bg="#FFFDF7" minH="100dvh">
      <Box maxW="7xl" mx="auto" px={{ base: "4", md: "6", lg: "8" }} py="10">
        <Outlet />
        <Footer />
      </Box>
    </Box>
  )
}