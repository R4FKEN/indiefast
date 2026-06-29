import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import type { BlogPost } from "@/types"
import { BLOG_CARD_HEIGHT } from "@/constants"

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
  const displayTitle = post.title.split(" | ")[0]

  return (
    <Link to={`/blog/${post.slug}`} style={{ display: "block", height: "100%" }}>
      <Box
        border="2px solid"
        borderColor="#1a1a1a"
        borderRadius="sm"
        bg="white"
        p="5"
        h={BLOG_CARD_HEIGHT}
        w="100%"
        boxShadow="4px 4px 0px #1a1a1a"
        transition="all 0.1s"
        display="flex"
        flexDirection="column"
        _hover={{
          transform: "translate(-2px, -2px)",
          boxShadow: "6px 6px 0px #1a1a1a",
        }}
      >
        <Flex direction="column" gap="2">
          <Text
            fontSize="xs"
            color="#666"
            fontWeight="bold"
            letterSpacing="wide"
            flexShrink={0}
          >
            {formatDate(post.publishedAt)}
          </Text>
          <Heading
            as="h2"
            fontSize="lg"
            fontWeight="black"
            color="#1a1a1a"
            lineHeight="shorter"
            lineClamp={2}
            flexShrink={0}
          >
            {displayTitle}
          </Heading>
          <Text
            fontSize="sm"
            color="#444"
            lineHeight="tall"
            lineClamp={3}
          >
            {post.excerpt}
          </Text>
        </Flex>
      </Box>
    </Link>
  )
}