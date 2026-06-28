import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { BLOG_POSTS } from "@/data/blog-posts"
import { BlogPostCard } from "@/components/BlogPostCard"
import { SITE_COPY } from "@/constants/site-copy"

export function BlogPage() {
  useEffect(() => {
    document.title = `Blog — ${SITE_COPY.name}`
  }, [])

  return (
    <Box>
      <Box mb="10">
        <Heading
          fontSize="3xl"
          fontWeight="black"
          fontFamily="heading"
          letterSpacing="tight"
          color="#1a1a1a"
          mb="3"
        >
          Blog
        </Heading>
        <Text fontSize="md" color="#444" maxW="2xl" lineHeight="tall" fontWeight="medium">
          Stories, guides, and lessons from the indie maker path.
        </Text>
      </Box>

      {BLOG_POSTS.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py="20"
          px="6"
          border="2px dashed"
          borderColor="#e7dfcf"
          borderRadius="sm"
          bg="white"
        >
          <Text fontSize="lg" fontWeight="black" color="#1a1a1a" mb="2">
            No posts yet
          </Text>
          <Text fontSize="sm" color="#666" textAlign="center" maxW="md">
            Check back soon for guides and updates from the indiefa.st journey.
          </Text>
        </Flex>
      ) : (
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap="5"
        >
          {BLOG_POSTS.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </Grid>
      )}
    </Box>
  )
}