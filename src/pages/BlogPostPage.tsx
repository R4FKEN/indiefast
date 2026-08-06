import { Box, Heading, Text } from "@chakra-ui/react"
import { Link, Navigate, useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { BlogPostFaq } from "@/components/BlogPostFaq"
import { SITE_COPY } from "@/constants/site-copy"
import { BLOG_POSTS } from "@/data/blog-posts"
import { getBlogPostBySlug } from "@/utils/blog"

export function BlogPostPage() {
  const { "*": slugPath } = useParams()
  const post = slugPath ? getBlogPostBySlug(slugPath, BLOG_POSTS) : undefined

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const displayTitle = post.title.split(" | ")[0]

  return (
    <>
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.ogTitle} />
        <meta property="og:description" content={post.ogDescription} />
        <meta property="og:url" content={post.ogUrl} />
        <meta property="og:type" content={post.ogType ?? "article"} />
        <meta property="og:image" content={SITE_COPY.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.ogTitle} />
        <meta name="twitter:description" content={post.ogDescription} />
        <meta name="twitter:image" content={SITE_COPY.ogImage} />
        <link rel="canonical" href={post.canonical} />
        {post.faqSchema ? (
          <script type="application/ld+json">
            {JSON.stringify(post.faqSchema)}
          </script>
        ) : null}
      </Helmet>
      <Box maxW="3xl">
      <Link to="/blog">
        <Text
          fontSize="sm"
          color="#666"
          fontWeight="bold"
          mb="6"
          display="inline-block"
          _hover={{ color: "#1a1a1a", textDecoration: "underline" }}
        >
          ← Back to Blog
        </Text>
      </Link>

      <Box
        border="2px solid"
        borderColor="#1a1a1a"
        borderRadius="sm"
        bg="white"
        p={{ base: "5", md: "8" }}
        boxShadow="4px 4px 0px #1a1a1a"
      >
        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="black"
          color="#1a1a1a"
          lineHeight="shorter"
          mb="6"
        >
          {displayTitle}
        </Heading>

        <Box
          className="blog-content"
          fontSize="md"
          color="#333"
          lineHeight="tall"
          css={{
            "& h2": {
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "#1a1a1a",
              marginTop: "2rem",
              marginBottom: "0.75rem",
              lineHeight: 1.3,
            },
            "& h3": {
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#1a1a1a",
              marginTop: "1.5rem",
              marginBottom: "0.5rem",
            },
            "& p": {
              marginTop: "1rem",
              marginBottom: "1rem",
            },
            "& strong": {
              fontWeight: 700,
              color: "#1a1a1a",
            },
            "& a": {
              color: "#1d6fd8",
              fontWeight: 600,
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            },
            "& ul": {
              marginTop: "1rem",
              marginBottom: "1rem",
              paddingLeft: "1.5rem",
            },
            "& li": {
              marginTop: "0.35rem",
              marginBottom: "0.35rem",
            },
            "& hr": {
              border: "none",
              borderTop: "1px solid #e7dfcf",
              marginTop: "2rem",
              marginBottom: "2rem",
            },
            "& > h1": {
              display: "none",
            },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          <BlogPostFaq schema={post.faqSchema} />
        </Box>
      </Box>
    </Box>
    </>
  )
}