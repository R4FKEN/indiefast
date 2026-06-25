import type { Tool } from "./types"
import { FALLBACK_TOOLS } from "./mock-data"

export async function fetchTools(): Promise<Tool[]> {
  // Production: bundled snapshot from last manual sync + deploy (no network wait)
  if (import.meta.env.PROD) {
    return FALLBACK_TOOLS
  }

  // Dev: read public/tools.json from disk (refresh via `npm run sync:tools`)
  try {
    const res = await fetch("/tools.json", { cache: "no-store" })
    if (!res.ok) throw new Error(`Snapshot error ${res.status}`)
    const data = await res.json()
    return data.tools as Tool[]
  } catch {
    console.log("[indiefa.st] tools.json unavailable. Using bundled fallback.")
    return FALLBACK_TOOLS
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