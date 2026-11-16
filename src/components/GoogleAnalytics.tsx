import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

const GA_MEASUREMENT_ID = "G-VRSSCV2D9T"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/** First title tag wins. React may leave it empty for a moment while the next route's title lands. */
function activeTitle() {
  for (const node of document.querySelectorAll("title")) {
    const text = node.textContent?.trim()
    if (text) return text
  }
  return ""
}

/**
 * gtag.js records the first page load. This records later client-side routes
 * once the blog post (if any) and document title have settled.
 */
export function GoogleAnalytics() {
  const location = useLocation()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}`
    if (lastPath.current === pagePath) return
    const isLanding = lastPath.current === null
    lastPath.current = pagePath
    if (isLanding) return

    let cancelled = false
    let timer = 0
    const started = Date.now()

    const send = () => {
      if (cancelled) return
      const title = activeTitle()
      const postLoading = document.querySelector("[data-blog-loading]") !== null
      const titlePending = document.querySelector("title")?.textContent?.trim() === ""
      if ((postLoading || titlePending || title === "") && Date.now() - started < 2000) {
        timer = window.setTimeout(send, 50)
        return
      }
      if (typeof window.gtag !== "function") return

      window.gtag("event", "page_view", {
        page_title: title,
        page_location: `${window.location.origin}${pagePath}`,
        page_path: pagePath,
        send_to: GA_MEASUREMENT_ID,
      })
    }

    timer = window.setTimeout(send, 0)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [location.pathname, location.search])

  return null
}
