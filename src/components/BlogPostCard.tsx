import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import type { BlogPost } from "@/types"

interface BlogPostCardProps {
  post: BlogPost
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Box
      border="2px solid"
      borderColor="#1a1a1a"
      borderRadius="sm"
      bg="white"
      p="5"
      boxShadow="4px 4px 0px #1a1a1a"
      transition="all 0.1s"
      _hover={{
        transform: "translate(-2px, -2px)",
        boxShadow: "6px 6px 0px #1a1a1a",
      }}
    >
      <Flex direction="column" gap="2">
        <Text fontSize="xs" color="#666" fontWeight="bold" letterSpacing="wide">
          {formatDate(post.publishedAt)}
        </Text>
        <Heading
          as="h2"
          fontSize="lg"
          fontWeight="black"
          color="#1a1a1a"
          lineHeight="shorter"
        >
          {post.title}
        </Heading>
        <Text fontSize="sm" color="#444" lineHeight="tall">
          {post.excerpt}
        </Text>
      </Flex>
    </Box>
  )
}