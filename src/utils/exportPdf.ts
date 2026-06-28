import { jsPDF } from "jspdf"
import type { Tool } from "../types"

const LOGO_URL = "/indiefast-logo-nobg-500x500.png"

async function loadImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
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

export async function exportStackToPdf(stack: Tool[]): Promise<void> {
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
    doc.addImage(logoData, "PNG", marginX, y, logoSize, logoSize)
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
    doc.setTextColor(120, 120, 120)
    doc.text(category.toUpperCase(), marginX, y)
    y += 6

    for (const tool of tools) {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(13)
      doc.setTextColor(30, 110, 220)
      const titleLines = doc.splitTextToSize(tool.Name, contentWidth) as string[]
      ensureSpace(titleLines.length * 6 + 10)

      titleLines.forEach((line, idx) => {
        const textWidth = doc.getTextWidth(line)
        doc.textWithLink(line, marginX, y, { url: tool.AffiliateURL })
        doc.setDrawColor(30, 110, 220)
        doc.setLineWidth(0.3)
        doc.line(marginX, y + 0.8, marginX + textWidth, y + 0.8)
        if (idx < titleLines.length - 1) y += 6
      })
      y += 6

      renderParagraph(tool.Reasoning || "")

      y += 4
    }

    y += 2
  }

  const footerHeight = 18
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
