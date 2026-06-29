import { Box, Heading, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { BlogPostFaq } from "@/components/BlogPostFaq"
import { BLOG_POSTS } from "@/data/blog-posts"
import { getBlogPostBySlug } from "@/utils/blog"

function setMetaTag(attribute: "name" | "property", key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`
  let tag = document.head.querySelector(selector)

  if (!tag) {
    tag = document.createElement("meta")
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }

  tag.setAttribute("content", content)
}

function setCanonicalLink(href: string) {
  let tag = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null

  if (!tag) {
    tag = document.createElement("link")
    tag.rel = "canonical"
    document.head.appendChild(tag)
  }

  tag.href = href
}

function setFaqSchema(schema?: Record<string, unknown>) {
  const existing = document.head.querySelector('script[data-blog-faq="true"]')
  existing?.remove()

  if (!schema) return

  const script = document.createElement("script")
  script.type = "application/ld+json"
  script.dataset.blogFaq = "true"
  script.textContent = JSON.stringify(schema)
  document.head.appendChild(script)
}

export function BlogPostPage() {
  const { "*": slugPath } = useParams()
  const post = slugPath ? getBlogPostBySlug(slugPath, BLOG_POSTS) : undefined

  useEffect(() => {
    if (!post) return

    document.title = post.title
    setMetaTag("name", "description", post.description)
    setMetaTag("property", "og:title", post.ogTitle)
    setMetaTag("property", "og:description", post.ogDescription)
    setMetaTag("property", "og:url", post.ogUrl)
    setMetaTag("property", "og:type", "article")
    setCanonicalLink(post.canonical)
    setFaqSchema(post.faqSchema)

    return () => {
      document.head.querySelector('script[data-blog-faq="true"]')?.remove()
    }
  }, [post])

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const displayTitle = post.title.split(" | ")[0]

  return (
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
  )
}