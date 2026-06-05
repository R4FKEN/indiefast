import type { Tool } from "./types"
import { MOCK_TOOLS } from "./mock-data"

const CACHE_KEY = "indiefst_tools_v2"
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

export async function fetchTools(): Promise<Tool[]> {
  const cached = getCachedTools()
  if (cached) return cached

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/tools`

  try {
    const res = await fetch(edgeFunctionUrl, {
      headers: { Authorization: `Bearer ${anonKey}` },
    })
    if (!res.ok) throw new Error(`API error ${res.status}`)
    const data = await res.json()
    const tools: Tool[] = data.tools
    setCachedTools(tools)
    return tools
  } catch {
    console.log("[indiefa.st] Edge function not reachable. Using local mock data.")
    return MOCK_TOOLS
  }
}

export async function submitEmail(email: string): Promise<{ success: boolean }> {
  const trimmed = email.trim()
  if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
    throw new Error("Invalid email address")
  }

  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmed }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Subscription failed")
    }

    return res.json()
  } catch {
    console.log(`[indiefa.st] Newsletter signup (local): ${trimmed}`)
    return { success: true }
  }
}
