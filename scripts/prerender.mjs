import fs from "node:fs/promises"
import http from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"
import puppeteer from "puppeteer"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.resolve(__dirname, "..", "dist")
const SITEMAP_PATH = path.resolve(__dirname, "..", "public", "sitemap.xml")
const SERVER_PORT = 4175
const ORIGIN = "https://indiefa.st"

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case ".html":
      return "text/html; charset=UTF-8"
    case ".js":
      return "application/javascript; charset=UTF-8"
    case ".css":
      return "text/css; charset=UTF-8"
    case ".json":
      return "application/json; charset=UTF-8"
    case ".svg":
      return "image/svg+xml"
    case ".png":
      return "image/png"
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".ico":
      return "image/x-icon"
    case ".gif":
      return "image/gif"
    case ".woff":
      return "font/woff"
    case ".woff2":
      return "font/woff2"
    case ".ttf":
      return "font/ttf"
    default:
      return "application/octet-stream"
  }
}

async function readRoutes() {
  const xml = await fs.readFile(SITEMAP_PATH, "utf8")
  const matches = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g))
  const routes = matches
    .map((match) => match[1].trim())
    .filter((loc) => loc.startsWith(ORIGIN))
    .map((loc) => loc.slice(ORIGIN.length) || "/")
    .map((route) => (route.endsWith("/") && route !== "/" ? route.slice(0, -1) : route))

  return [...new Set(routes)]
}

function createServer() {
  return http.createServer(async (req, res) => {
    if (!req.url) {
      res.writeHead(400)
      res.end("Bad request")
      return
    }

    const url = new URL(req.url, `http://127.0.0.1:${SERVER_PORT}`)
    const requestedPath = decodeURIComponent(url.pathname)
    const candidate = path.join(DIST_DIR, requestedPath)

    try {
      const stat = await fs.stat(candidate)
      if (stat.isDirectory()) {
        const indexFile = path.join(candidate, "index.html")
        const data = await fs.readFile(indexFile)
        res.writeHead(200, { "Content-Type": getContentType(indexFile) })
        res.end(data)
        return
      }
      if (stat.isFile()) {
        const data = await fs.readFile(candidate)
        res.writeHead(200, { "Content-Type": getContentType(candidate) })
        res.end(data)
        return
      }
    } catch {
      // fall through to SPA fallback
    }

    try {
      const indexFile = path.join(DIST_DIR, "index.html")
      const data = await fs.readFile(indexFile)
      res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" })
      res.end(data)
    } catch (error) {
      res.writeHead(500)
      res.end(String(error))
    }
  })
}

function routeToOutputPath(route) {
  if (route === "/") {
    return path.join(DIST_DIR, "index.html")
  }

  const trimmed = route.replace(/^\//, "")
  return path.join(DIST_DIR, trimmed, "index.html")
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
}

async function prerender() {
  const routes = await readRoutes()
  if (routes.length === 0) {
    throw new Error("No routes found in sitemap.xml. Cannot prerender.")
  }

  const server = createServer()
  await new Promise((resolve, reject) => {
    server.listen(SERVER_PORT, "127.0.0.1", (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(30000)

  try {
    for (const route of routes) {
      const url = `http://127.0.0.1:${SERVER_PORT}${route}`
      process.stdout.write(`Prerendering ${route} ... `)
      await page.goto(url, { waitUntil: "networkidle2" })
      await page.waitForSelector("#root", { timeout: 10000 })
      const html = await page.content()
      const outputPath = routeToOutputPath(route)
      await ensureDir(outputPath)
      await fs.writeFile(outputPath, html, "utf8")
      process.stdout.write("done\n")
    }
  } finally {
    await browser.close()
    server.close()
  }
}

prerender().catch((error) => {
  console.error("Prerender failed:", error)
  process.exit(1)
})
