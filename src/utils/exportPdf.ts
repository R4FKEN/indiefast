import type { Tool } from "../types"

type JsPdfDoc = InstanceType<typeof import("jspdf").jsPDF>

const LOGO_URL = "/indiefast-logo-nobg-500x500.png"

async function loadImageAsDataUrl(url: string): Promise<{
  dataUrl: string
  format: "PNG"
}> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Could not load ${url}`)
  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error(`Could not decode image ${url}`))
      element.src = objectUrl
    })
    const canvas = document.createElement("canvas")
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    const context = canvas.getContext("2d")
    if (!context) throw new Error("Could not create image canvas")
    context.drawImage(image, 0, 0)

    return { dataUrl: canvas.toDataURL("image/png"), format: "PNG" }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function categoryOrder(category: string): number {
  const match = category.match(/^(\d+)\./)
  return match ? parseInt(match[1], 10) : 999
}

function todayString(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function parseHoursSaved(timeSaved: string): number {
  if (!timeSaved) return 0
  const match = timeSaved.match(/(\d+(?:\.\d+)?)\s*h/i)
  return match ? parseFloat(match[1]) : 0
}

function sumMonthlyHoursSaved(stack: Tool[]): number {
  return stack.reduce((sum, tool) => sum + parseHoursSaved(tool.TimeSaved), 0)
}

function formatStackHoursLabel(totalHours: number): string {
  const rounded = Math.round(totalHours)
  const unit = rounded === 1 ? "hour" : "hours"
  return `${rounded} ${unit} per month saved using this stack.`
}

const PILL_FILL: [number, number, number] = [240, 253, 244]
const PILL_BORDER: [number, number, number] = [22, 163, 74]
const PILL_TEXT: [number, number, number] = [22, 163, 74]

function renderMonthlySavingsPill(
  doc: JsPdfDoc,
  centerX: number,
  y: number,
  label: string,
): number {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  const textWidth = doc.getTextWidth(label)
  const padX = 6
  const pillWidth = textWidth + padX * 2
  const pillHeight = 10
  const pillX = centerX - pillWidth / 2
  const pillY = y - pillHeight + 2

  doc.setFillColor(...PILL_FILL)
  doc.setDrawColor(...PILL_BORDER)
  doc.setLineWidth(0.5)
  doc.roundedRect(pillX, pillY, pillWidth, pillHeight, 1.2, 1.2, "FD")

  doc.setTextColor(...PILL_TEXT)
  doc.text(label, centerX, pillY + pillHeight / 2, {
    align: "center",
    baseline: "middle",
  })

  return pillHeight + 6
}

export async function exportStackToPdf(stack: Tool[]): Promise<void> {
  // Load jspdf only when the user exports (keeps it off the homepage critical path)
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginX = 18
  const marginTop = 18
  const marginBottom = 22
  const contentWidth = pageWidth - marginX * 2

  let y = marginTop

  const logoData = await loadImageAsDataUrl(LOGO_URL).catch(() => null)
  const logoSize = 18
  if (logoData) {
    doc.addImage(logoData.dataUrl, logoData.format, marginX, y, logoSize, logoSize)
  }

  doc.setFont("helvetica", "bold")
  doc.setTextColor(26, 26, 26)
  doc.setFontSize(20)
  doc.text("IndieFast - Your Custom Stack", marginX + logoSize + 6, y + logoSize / 2 + 2)

  y += logoSize + 10

  doc.setDrawColor(26, 26, 26)
  doc.setLineWidth(0.4)
  doc.line(marginX, y, pageWidth - marginX, y)
  y += 8

  const sorted = [...stack].sort((a, b) => {
    const diff = categoryOrder(a.Category) - categoryOrder(b.Category)
    if (diff !== 0) return diff
    return 0
  })

  const grouped = new Map<string, Tool[]>()
  for (const tool of sorted) {
    const list = grouped.get(tool.Category) ?? []
    list.push(tool)
    grouped.set(tool.Category, list)
  }

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - marginBottom) {
      doc.addPage()
      y = marginTop
    }
  }

  const renderParagraph = (text: string) => {
    if (!text) return
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)
    const lines = doc.splitTextToSize(text, contentWidth) as string[]
    ensureSpace(lines.length * 5 + 4)
    for (const line of lines) {
      doc.text(line, marginX, y)
      y += 5
    }
    y += 2
  }

  for (const [category, tools] of grouped) {
    ensureSpace(14)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.setTextColor(80, 80, 80)
    doc.text(category.toUpperCase(), marginX, y)
    y += 9

    for (const tool of tools) {
      const titleLogoSize = 6
      const titleLogo = tool.LogoUrl
        ? await loadImageAsDataUrl(tool.LogoUrl).catch(() => null)
        : null

      let discountWidth = 0
      if (tool.Discount) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(8)
        discountWidth = doc.getTextWidth(tool.Discount) + 4
      }

      const titleStartX = marginX + titleLogoSize + 4
      const titleAvailableWidth =
        contentWidth - titleLogoSize - 4 - (discountWidth ? discountWidth + 4 : 0)

      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      doc.setTextColor(30, 110, 220)
      const titleLines = doc.splitTextToSize(tool.Name, titleAvailableWidth) as string[]
      ensureSpace(titleLines.length * 6 + 10)

      if (titleLogo) {
        doc.addImage(
          titleLogo.dataUrl,
          titleLogo.format,
          marginX,
          y + (titleLines.length - 1) * 6 + 0.8 - titleLogoSize,
          titleLogoSize,
          titleLogoSize,
        )
      }

      titleLines.forEach((line, idx) => {
        const textWidth = doc.getTextWidth(line)
        const titleY = y + idx * 6
        doc.textWithLink(line, titleStartX, titleY, { url: tool.AffiliateURL })
        doc.setDrawColor(30, 110, 220)
        doc.setLineWidth(0.3)
        doc.line(titleStartX, titleY + 0.8, titleStartX + textWidth, titleY + 0.8)
      })

      if (tool.Discount) {
        const badgeHeight = 6
        const badgeX = pageWidth - marginX - discountWidth
        const badgeY = y - 4.5

        doc.setFillColor(255, 107, 107)
        doc.setDrawColor(26, 26, 26)
        doc.setLineWidth(0.4)
        doc.roundedRect(badgeX, badgeY, discountWidth, badgeHeight, 1.2, 1.2, "FD")
        doc.setFont("helvetica", "bold")
        doc.setFontSize(8)
        doc.setTextColor(255, 255, 255)
        doc.text(tool.Discount, badgeX + 2, badgeY + 4)
      }

      y += Math.max(titleLines.length * 6, titleLogo ? titleLogoSize : 0)

      renderParagraph(tool.Reasoning || "")

      y += 4
    }

    y += 2
  }

  const monthlyHours = sumMonthlyHoursSaved(stack)
  const pillLabel = formatStackHoursLabel(monthlyHours)
  const pillBlockHeight = 18
  const footerHeight = 18

  ensureSpace(pillBlockHeight + footerHeight)
  y += 4
  y += renderMonthlySavingsPill(doc, pageWidth / 2, y, pillLabel)
  y += 6

  if (y + footerHeight > pageHeight - marginBottom) {
    doc.addPage()
    y = marginTop
  }
  y = pageHeight - marginBottom

  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.setTextColor(26, 26, 26)
  const luckLine = "Best of luck!"
  const luckWidth = doc.getTextWidth(luckLine)
  doc.text(luckLine, (pageWidth - luckWidth) / 2, y)

  y += 6
  const urlText = "https://indiefa.st"
  doc.setTextColor(30, 110, 220)
  const urlWidth = doc.getTextWidth(urlText)
  const urlX = (pageWidth - urlWidth) / 2
  doc.textWithLink(urlText, urlX, y, { url: "https://indiefa.st" })
  doc.setDrawColor(30, 110, 220)
  doc.setLineWidth(0.3)
  doc.line(urlX, y + 0.8, urlX + urlWidth, y + 0.8)

  doc.save(`indiefast-stack-${todayString()}.pdf`)
}
