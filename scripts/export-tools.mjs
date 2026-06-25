import "dotenv/config"
import { syncToolsSnapshot } from "../shared/sync-tools-snapshot.mjs"

syncToolsSnapshot().catch((error) => {
  console.error("[tools snapshot] Failed:", error.message)
  process.exit(1)
})