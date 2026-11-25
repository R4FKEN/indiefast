import { Box, Heading, Text } from "@chakra-ui/react"
import { Link, Navigate, useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { BlogPostFaq } from "@/components/BlogPostFaq"
import { JsonLd } from "@/components/JsonLd"
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "@/components/ui/breadcrumb"
import { SITE_COPY } from "@/constants/site-copy"
import { loadBlogPostBySlug } from "@/data/blog-posts"
import type { BlogPost } from "@/types"
import {
  blogPostingSchema,
  breadcrumbListSchema,
  type BreadcrumbItem,
} from "@/utils/structuredData"

type LoadState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "ready"; post: BlogPost }

export function BlogPostPage() {
  const { "*": slugPath } = useParams()
  const [state, setState] = useState<LoadState>({ status: "loading" })

  useEffect(() => {
    if (!slugPath) {
      setState({ status: "missing" })
      return
    }

    let cancelled = false
    setState({ status: "loading" })

    loadBlogPostBySlug(slugPath)
      .then((post) => {
        if (cancelled) return
        setState(post ? { status: "ready", post } : { status: "missing" })
      })
      .catch((err) => {
        console.error("[indiefa.st] Failed to load post", err)
        if (!cancelled) setState({ status: "missing" })
      })

    return () => {
      cancelled = true
    }
  }, [slugPath])

  if (state.status === "missing") {
    return <Navigate to="/blog" replace />
  }

  if (state.status === "loading") {
    return (
      <Box maxW="3xl" data-page="blog-post" data-blog-loading>
        <Text fontSize="sm" color="#666" fontWeight="medium" py="10">
          Loading…
        </Text>
      </Box>
    )
  }

  const { post } = state
  const displayTitle = post.title.split(" | ")[0]
  const slugSegments = post.slug.split("/")
  const parentBreadcrumbs: BreadcrumbItem[] = slugSegments.slice(0, -1).map((segment, index) => {
    const path = slugSegments.slice(0, index + 1).join("/")
    const name = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    return { name, url: `https://indiefa.st/blog/${path}` }
  })
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", url: "https://indiefa.st/" },
    { name: "Blog", url: "https://indiefa.st/blog" },
    ...parentBreadcrumbs,
    { name: displayTitle, url: post.canonical },
  ]

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
      </Helmet>
      <JsonLd data={blogPostingSchema(post)} />
      <JsonLd data={breadcrumbListSchema(breadcrumbs)} />
      {post.faqSchema && <JsonLd data={post.faqSchema} />}
      <Box maxW="3xl" data-page="blog-post">
        <BreadcrumbRoot mb="6" aria-label="Breadcrumb">
          {breadcrumbs.slice(0, -1).map((item) => (
            <BreadcrumbLink key={item.url} asChild>
              <Link to={item.url.replace("https://indiefa.st", "")}>{item.name}</Link>
            </BreadcrumbLink>
          ))}
          <BreadcrumbCurrentLink>{displayTitle}</BreadcrumbCurrentLink>
        </BreadcrumbRoot>

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
