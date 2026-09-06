import type { Tool } from "./types"

async function loadToolsFromSnapshot(): Promise<Tool[]> {
  const res = await fetch("/tools.json", {
    cache: import.meta.env.PROD ? "force-cache" : "no-store",
  })
  if (!res.ok) throw new Error(`Snapshot error ${res.status}`)
  const data = (await res.json()) as { tools?: Tool[] }
  if (!Array.isArray(data.tools)) throw new Error("Invalid tools.json shape")
  return data.tools
}

/** Tools always come from the static `/tools.json` asset (not inlined into JS). */
export async function fetchTools(): Promise<Tool[]> {
  try {
    return await loadToolsFromSnapshot()
  } catch (err) {
    console.log(
      "[indiefa.st] tools.json unavailable.",
      err instanceof Error ? err.message : err,
    )
    return []
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
