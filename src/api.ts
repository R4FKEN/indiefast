import type { Tool } from "./types"
import { FALLBACK_TOOLS } from "./mock-data"

const CACHE_KEY = "*****************"
const CACHE_TTL = 5 * 60 * 1000

interface CachedData {
  tools: Tool[]
  timestamp: number
}

function getCachedTools(): Tool[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached: CachedData = JSON.parse(raw)
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY)
      return null
    }
    return cached.tools
  } catch {
    return null
  }
}

function setCachedTools(tools: Tool[]): void {
  try {
    const data: CachedData = { tools, timestamp: Date.now() }
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // storage full or unavailable
  }
}

async function fetchToolsFrom(url: string): Promise<Tool[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  const tools: Tool[] = data.tools
  setCachedTools(tools)
  return tools
}

export async function fetchTools(): Promise<Tool[]> {
  const cached = getCachedTools()
  if (cached) return cached

  try {
    return await fetchToolsFrom("/tools.json")
  } catch {
    try {
      return await fetchToolsFrom("/api/tools")
    } catch {
      console.log("[indiefa.st] Data source not reachable. Using tools snapshot.")
      return FALLBACK_TOOLS
    }
  }
}

export async function submitEmail(email: string): Promise<{ success: boolean }> {
  const trimmed = email.trim().toLowerCase()
  if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
    throw new Error("Invalid email address")
  }

  const res = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: trimmed }),
  })

  let data: { success?: boolean; error?: string } = {}
  try {
    data = await res.json()
  } catch {
    // ignore non-JSON error bodies
  }

  if (!res.ok) {
    throw new Error(data.error || "Subscription failed")
  }

  return { success: data.success ?? true }
}
