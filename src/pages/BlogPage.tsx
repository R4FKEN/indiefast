import { Box, Flex, Grid, Heading, Image, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { useEffect, useState } from "react"
import { loadAllBlogPosts } from "@/data/blog-posts"
import { BlogPostCard } from "@/components/BlogPostCard"
import { BreadcrumbCurrentLink, BreadcrumbLink, BreadcrumbRoot } from "@/components/ui/breadcrumb"
import { JsonLd } from "@/components/JsonLd"
import { SITE_COPY } from "@/constants/site-copy"
import type { BlogPost } from "@/types"
import { breadcrumbListSchema, itemListSchema } from "@/utils/structuredData"

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null)

  useEffect(() => {
    let cancelled = false
    loadAllBlogPosts()
      .then((list) => {
        if (!cancelled) setPosts(list)
      })
      .catch((err) => {
        console.error("[indiefa.st] Failed to load blog posts", err)
        if (!cancelled) setPosts([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const indexPosts =
    posts === null
      ? null
      : [...posts]
          .filter((post) => !post.slug.includes("/"))
          .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))

  return (
    <>
      <Helmet>
        <title>Blog — {SITE_COPY.name}</title>
        <meta name="description" content="Stories, guides, and lessons from the indie maker path." />
        <meta property="og:title" content={`Blog — ${SITE_COPY.name}`} />
        <meta property="og:description" content="Stories, guides, and lessons from the indie maker path." />
        <meta property="og:url" content="https://indiefa.st/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={SITE_COPY.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={SITE_COPY.ogImage} />
        <link rel="canonical" href="https://indiefa.st/blog" />
      </Helmet>
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", url: "https://indiefa.st/" },
          { name: "Blog", url: "https://indiefa.st/blog" },
        ])}
      />
      {indexPosts && indexPosts.length > 0 && (
        <JsonLd
          data={itemListSchema(
            "IndieFast blog",
            indexPosts.map((post) => ({
              name: post.title,
              description: post.description,
              url: post.canonical,
            })),
          )}
        />
      )}
      <Box data-page="blog-index">
        <BreadcrumbRoot mb="6" aria-label="Breadcrumb">
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
          <BreadcrumbCurrentLink>Blog</BreadcrumbCurrentLink>
        </BreadcrumbRoot>

        <Box mb="10">
          <Flex alignItems="center" gap="1" mb="4">
            <Heading
              as="h1"
              fontSize="3xl"
              fontWeight="black"
              fontFamily="heading"
              letterSpacing="tight"
              color="#1a1a1a"
              display="flex"
              alignItems="center"
              gap="1"
              mb="0"
            >
              <Link to="/">
                <Flex
                  alignItems="center"
                  gap="1"
                  _hover={{ opacity: 0.85 }}
                  aria-label="Back to indiefa.st homepage"
                >
                  <Image
                    src="/indiefast-logo-nobg-500x500.png"
                    alt="indiefa.st logo"
                    w="64px"
                    h="64px"
                    flexShrink="0"
                    objectFit="contain"
                  />
                  <Box
                    as="span"
                    fontSize="inherit"
                    fontWeight="inherit"
                    fontFamily="inherit"
                    letterSpacing="inherit"
                    color="inherit"
                  >
                    {SITE_COPY.name}
                  </Box>
                </Flex>
              </Link>
              <Box
                as="span"
                fontSize="inherit"
                fontWeight="inherit"
                fontFamily="inherit"
                letterSpacing="inherit"
                color="inherit"
              >
                {" - blog"}
              </Box>
            </Heading>
          </Flex>
          <Text fontSize="md" color="#444" maxW="2xl" lineHeight="tall" fontWeight="medium">
            Stories, guides, and lessons from the indie maker path.
          </Text>
        </Box>

        {indexPosts === null ? (
          <Text fontSize="sm" color="#666" data-blog-loading py="8">
            Loading posts…
          </Text>
        ) : indexPosts.length === 0 ? (
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
            data-blog-grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap="5"
            alignItems="stretch"
          >
            {indexPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </Grid>
        )}
      </Box>
    </>
  )
}
