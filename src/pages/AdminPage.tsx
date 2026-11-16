import { Box, Button, Flex, Grid, Input, Text, Textarea } from "@chakra-ui/react"
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react"
import type { Tool } from "@/types"

const CATEGORIES = [
  "1. Discover",
  "2. Research",
  "3. Validate",
  "4. Plan",
  "5. Design",
  "6. Build",
  "7. Backend",
  "8. Ship",
  "9. Monetize",
  "10. Measure",
  "11. Grow",
] as const

const GROW_SUBTOPICS = [
  "Automate",
  "Scale",
  "Community",
  "Support",
  "SEO",
  "Distribution",
] as const

const EMPTY_TOOL: Tool = {
  id: "",
  Name: "",
  Category: "1. Discover",
  SecondCategory: "",
  OneLiner: "",
  Reasoning: "",
  TimeSaved: "",
  Pricing: "",
  AffiliateURL: "",
  Discount: "",
  Featured: false,
  Subtopic: "",
  LogoUrl: "",
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function copyTool(tool: Tool): Tool {
  return {
    ...EMPTY_TOOL,
    ...tool,
    Reasoning: tool.Reasoning ?? "",
    LogoUrl: tool.LogoUrl ?? "",
  }
}

async function readError(res: Response) {
  const data = (await res.json().catch(() => null)) as { error?: string } | null
  return data?.error || `Request failed (${res.status})`
}

async function fileToBase64(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error("Could not read the logo"))
    reader.readAsDataURL(file)
  })
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) throw new Error("Could not read the logo")
  return { contentType: match[1], dataBase64: match[2] }
}

const selectStyle = {
  width: "100%",
  background: "white",
  border: "2px solid #1a1a1a",
  borderRadius: "2px",
  padding: "6px 8px",
  fontSize: "14px",
  color: "#1a1a1a",
} as const

const controlProps = {
  bg: "white",
  border: "2px solid",
  borderColor: "#1a1a1a",
  borderRadius: "sm",
  color: "#1a1a1a",
  fontSize: "sm",
  px: "2",
  py: "1.5",
  w: "full",
} as const

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} style={{ fontSize: "12px", fontWeight: 700, color: "#1a1a1a" }}>
      {children}
    </label>
  )
}

export function AdminPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [draft, setDraft] = useState<Tool>(EMPTY_TOOL)
  const [mode, setMode] = useState<"new" | "edit">("new")
  const [query, setQuery] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState("")
  const [status, setStatus] = useState<"loading" | "ready" | "saving">("loading")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    fetch("/api/admin/tools")
      .then(async (res) => {
        if (!res.ok) throw new Error(await readError(res))
        return res.json() as Promise<{ tools: Tool[] }>
      })
      .then((data) => {
        if (cancelled) return
        setTools(data.tools)
        setStatus("ready")
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setStatus("ready")
        setError(err instanceof Error ? err.message : "Could not load tools")
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview("")
      return
    }
    const url = URL.createObjectURL(logoFile)
    setLogoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [logoFile])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return [...tools]
      .filter((tool) => {
        if (!needle) return true
        return (
          tool.Name.toLowerCase().includes(needle) || tool.id.toLowerCase().includes(needle)
        )
      })
      .sort((a, b) => a.Name.localeCompare(b.Name))
  }, [tools, query])

  function update<K extends keyof Tool>(key: K, value: Tool[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
    setMessage("")
  }

  function selectTool(tool: Tool) {
    setMode("edit")
    setDraft(copyTool(tool))
    setLogoFile(null)
    setError("")
    setMessage("")
  }

  function startNew() {
    setMode("new")
    setDraft(EMPTY_TOOL)
    setLogoFile(null)
    setError("")
    setMessage("")
  }

  async function saveCatalog(nextTools: Tool[], logo?: { id: string; contentType: string; dataBase64: string }) {
    const res = await fetch("/api/admin/tools", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tools: nextTools, logo }),
    })
    if (!res.ok) throw new Error(await readError(res))
    const saved = (await res.json()) as { tools: Tool[] }
    setTools(saved.tools)
    return saved.tools
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault()
    setError("")
    setMessage("")
    setStatus("saving")
    try {
      let logo: { id: string; contentType: string; dataBase64: string } | undefined
      if (logoFile) {
        const encoded = await fileToBase64(logoFile)
        logo = { id: draft.id.trim(), ...encoded }
      }
      const nextTool = copyTool({ ...draft, id: draft.id.trim() })
      if (mode === "new" && tools.some((tool) => tool.id === nextTool.id)) {
        throw new Error(`Id "${nextTool.id}" is already used. Pick another id.`)
      }
      const nextTools =
        mode === "edit"
          ? tools.map((tool) => (tool.id === nextTool.id ? nextTool : tool))
          : [...tools, nextTool]
      const saved = await saveCatalog(nextTools, logo)
      const fresh = saved.find((tool) => tool.id === nextTool.id)
      if (fresh) setDraft(copyTool(fresh))
      setMode("edit")
      setLogoFile(null)
      setMessage("Saved to public/tools.json. Commit it when you want it on the live site.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setStatus("ready")
    }
  }

  async function handleDelete() {
    if (mode === "new") {
      startNew()
      return
    }
    const label = draft.Name || draft.id
    if (!window.confirm(`Remove ${label} from the affiliate list?`)) return
    setError("")
    setMessage("")
    setStatus("saving")
    try {
      await saveCatalog(tools.filter((tool) => tool.id !== draft.id))
      startNew()
      setMessage(`Removed ${label}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove that tool")
    } finally {
      setStatus("ready")
    }
  }

  const previewSrc = logoPreview || draft.LogoUrl

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="black" color="#1a1a1a" mb="1">
        Affiliate admin
      </Text>
      <Text fontSize="sm" color="#444" mb="6" maxW="3xl">
        Local only. Saves write `public/tools.json` and `public/tool-logos/` on this machine.
        Commit those files to publish. This page is not on the live site.
      </Text>

      <Grid templateColumns={{ base: "1fr", lg: "240px 1fr" }} gap="6" alignItems="start">
        <Box>
          <Button
            type="button"
            size="sm"
            mb="3"
            w="full"
            bg="#1a1a1a"
            color="white"
            border="2px solid"
            borderColor="#1a1a1a"
            borderRadius="sm"
            fontWeight="bold"
            onClick={startNew}
          >
            New tool
          </Button>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search tools"
            {...controlProps}
            mb="3"
          />
          <Box
            border="2px solid"
            borderColor="#1a1a1a"
            borderRadius="sm"
            bg="white"
            maxH="70vh"
            overflowY="auto"
          >
            {visible.map((tool) => {
              const selected = mode === "edit" && tool.id === draft.id
              return (
                <Button
                  key={tool.id}
                  type="button"
                  onClick={() => selectTool(tool)}
                  w="full"
                  justifyContent="flex-start"
                  borderRadius="0"
                  bg={selected ? "#FFE66D" : "white"}
                  color="#1a1a1a"
                  fontWeight={selected ? "bold" : "medium"}
                  fontSize="sm"
                  px="3"
                  py="2"
                  h="auto"
                  whiteSpace="normal"
                  textAlign="left"
                  _hover={{ bg: selected ? "#FFE66D" : "#f6f6f6" }}
                >
                  {tool.Name}
                </Button>
              )
            })}
            {visible.length === 0 && (
              <Text fontSize="sm" color="#666" p="3">
                {status === "loading" ? "Loading…" : "No tools match."}
              </Text>
            )}
          </Box>
        </Box>

        <Box
          as="form"
          onSubmit={handleSave}
          border="2px solid"
          borderColor="#1a1a1a"
          borderRadius="sm"
          bg="white"
          p="5"
          boxShadow="4px 4px 0px #1a1a1a"
        >
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="4">
            <Box>
              <FieldLabel htmlFor="tool-name">Name</FieldLabel>
              <Input
                id="tool-name"
                value={draft.Name}
                onChange={(event) => update("Name", event.target.value)}
                onBlur={() => {
                  if (mode === "new" && !draft.id.trim()) update("id", slugify(draft.Name))
                }}
                {...controlProps}
              />
            </Box>
            <Box>
              <FieldLabel htmlFor="tool-id">Id</FieldLabel>
              <Input
                id="tool-id"
                value={draft.id}
                readOnly={mode === "edit"}
                onChange={(event) => update("id", event.target.value)}
                {...controlProps}
                bg={mode === "edit" ? "#f3f3f3" : "white"}
              />
            </Box>
            <Box>
              <FieldLabel htmlFor="tool-category">Category</FieldLabel>
              <select
                id="tool-category"
                value={draft.Category}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  update("Category", event.target.value)
                }
                style={selectStyle}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Box>
            <Box>
              <FieldLabel htmlFor="tool-second">Second category</FieldLabel>
              <select
                id="tool-second"
                value={draft.SecondCategory}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  update("SecondCategory", event.target.value)
                }
                style={selectStyle}
              >
                <option value="">None</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Box>
            <Box gridColumn={{ md: "1 / -1" }}>
              <FieldLabel htmlFor="tool-oneliner">One-liner</FieldLabel>
              <Textarea
                id="tool-oneliner"
                value={draft.OneLiner}
                onChange={(event) => update("OneLiner", event.target.value)}
                rows={2}
                {...controlProps}
              />
            </Box>
            <Box gridColumn={{ md: "1 / -1" }}>
              <FieldLabel htmlFor="tool-reasoning">Reasoning</FieldLabel>
              <Textarea
                id="tool-reasoning"
                value={draft.Reasoning}
                onChange={(event) => update("Reasoning", event.target.value)}
                rows={4}
                {...controlProps}
              />
              <Text fontSize="xs" color="#666" mt="1">
                Shown on the card. The one-liner is the fallback, and both go into the LLM files on the next build.
              </Text>
            </Box>
            <Box>
              <FieldLabel htmlFor="tool-time">Time saved</FieldLabel>
              <Input
                id="tool-time"
                value={draft.TimeSaved}
                onChange={(event) => update("TimeSaved", event.target.value)}
                placeholder="15hr / month"
                {...controlProps}
              />
            </Box>
            <Box>
              <FieldLabel htmlFor="tool-pricing">Pricing</FieldLabel>
              <Input
                id="tool-pricing"
                value={draft.Pricing}
                onChange={(event) => update("Pricing", event.target.value)}
                placeholder="Free tier / $49/mo"
                {...controlProps}
              />
            </Box>
            <Box gridColumn={{ md: "1 / -1" }}>
              <FieldLabel htmlFor="tool-url">Affiliate URL</FieldLabel>
              <Input
                id="tool-url"
                value={draft.AffiliateURL}
                onChange={(event) => update("AffiliateURL", event.target.value)}
                placeholder="https://…"
                {...controlProps}
              />
            </Box>
            <Box>
              <FieldLabel htmlFor="tool-discount">Discount</FieldLabel>
              <Input
                id="tool-discount"
                value={draft.Discount}
                onChange={(event) => update("Discount", event.target.value)}
                placeholder="Leave blank for no badge"
                {...controlProps}
              />
            </Box>
            <Box>
              <FieldLabel htmlFor="tool-subtopic">Grow subtopic</FieldLabel>
              <select
                id="tool-subtopic"
                value={draft.Subtopic}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  update("Subtopic", event.target.value)
                }
                style={selectStyle}
              >
                <option value="">None</option>
                {GROW_SUBTOPICS.map((subtopic) => (
                  <option key={subtopic} value={subtopic}>
                    {subtopic}
                  </option>
                ))}
              </select>
            </Box>
            <Flex align="center" gap="2" mt="2">
              <input
                id="tool-featured"
                type="checkbox"
                checked={draft.Featured}
                onChange={(event) => update("Featured", event.target.checked)}
              />
              <label htmlFor="tool-featured" style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a" }}>
                Popular badge
              </label>
            </Flex>
            <Box>
              <FieldLabel htmlFor="tool-logo">Logo</FieldLabel>
              <Input
                id="tool-logo"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
                {...controlProps}
                py="1"
              />
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt=""
                  width={48}
                  height={48}
                  style={{ objectFit: "contain", marginTop: "8px" }}
                />
              ) : (
                <Text fontSize="xs" color="#666" mt="1">
                  No logo yet. The card will show the first letter of the name.
                </Text>
              )}
            </Box>
          </Grid>

          {error && (
            <Text mt="4" fontSize="sm" fontWeight="bold" color="#9f1239">
              {error}
            </Text>
          )}
          {message && (
            <Text mt="4" fontSize="sm" fontWeight="bold" color="#166534">
              {message}
            </Text>
          )}

          <Flex gap="3" mt="5">
            <Button
              type="submit"
              size="sm"
              bg="#1a1a1a"
              color="white"
              border="2px solid"
              borderColor="#1a1a1a"
              borderRadius="sm"
              fontWeight="bold"
              loading={status === "saving"}
              disabled={status === "saving"}
            >
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              bg="white"
              color="#1a1a1a"
              border="2px solid"
              borderColor="#1a1a1a"
              borderRadius="sm"
              fontWeight="bold"
              onClick={handleDelete}
              disabled={status === "saving" || (mode === "new" && !draft.id)}
            >
              Remove
            </Button>
          </Flex>
        </Box>
      </Grid>
    </Box>
  )
}
