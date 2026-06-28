import { Box, Flex, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

export function Footer() {
  return (
    <Box
      as="footer"
      mt="8"
      pt="5"
      pb="2"
      borderTop="1px solid"
      borderColor="#e7dfcf"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        gap="3"
      >
        <Text fontSize="xs" color="#666" lineHeight="tall" maxW="3xl">
          Some links on this site may be affiliate links, which means I may earn a small
          commission at no extra cost to you. I only recommend tools and products I
          genuinely find useful.
        </Text>
        <Flex align="center" gap="4" flexShrink={0}>
          <Link to="/blog">
            <Text
              fontSize="xs"
              color="#666"
              fontWeight="bold"
              _hover={{ color: "#1a1a1a", textDecoration: "underline" }}
            >
              Blog
            </Text>
          </Link>
          <Text fontSize="xs" color="#666" whiteSpace="nowrap">
            IndieFast © 2026 All rights reserved.
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}
