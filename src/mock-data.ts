import type { Tool } from "./types"
import snapshot from "../public/tools.json"

/** Bundled snapshot — served immediately in prod; refresh via `npm run sync:tools` then deploy */
export const FALLBACK_TOOLS: Tool[] = snapshot.tools