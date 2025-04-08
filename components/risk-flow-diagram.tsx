"use client"

import { useRef, useEffect } from "react"
import { useProjectData } from "@/context/project-data-context"

export function RiskFlowDiagram() {
  const { analysisData } = useProjectData()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Extract risk data
  const risks = analysisData?.riskAssessment || []

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up the diagram dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    // Draw project node in center
    ctx.beginPath()
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2)
    ctx.fillStyle = "#4287f5"
    ctx.fill()

    // Add project text
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "white"
    ctx.font = "14px Arial"
    ctx.fillText("PROJECT", centerX, centerY)

    // Draw risk nodes around the project
    const riskCount = risks.length || 3
    const radius = Math.min(width, height) / 2 - 60

    for (let i = 0; i < riskCount; i++) {
      const risk = risks[i] || {
        title: `Risk ${i + 1}`,
        severity: i === 0 ? "Critical" : i === 1 ? "High" : "Medium",
      }

      const angle = i * ((Math.PI * 2) / riskCount)
      const riskX = centerX + radius * Math.cos(angle)
      const riskY = centerY + radius * Math.sin(angle)

      // Draw connection line
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(riskX, riskY)
      ctx.strokeStyle = "#999"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw risk node
      ctx.beginPath()
      ctx.arc(riskX, riskY, 35, 0, Math.PI * 2)

      // Color based on severity
      if (risk.severity === "Critical") {
        ctx.fillStyle = "#e74c3c"
      } else if (risk.severity === "High") {
        ctx.fillStyle = "#f39c12"
      } else {
        ctx.fillStyle = "#3498db"
      }

      ctx.fill()

      // Add risk text
      ctx.fillStyle = "white"
      ctx.font = "12px Arial"

      // Split text into lines if needed
      const title = risk.title || `Risk ${i + 1}`
      if (title.length > 10) {
        const words = title.split(" ")
        const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ")
        const line2 = words.slice(Math.ceil(words.length / 2)).join(" ")
        ctx.fillText(line1, riskX, riskY - 6)
        ctx.fillText(line2, riskX, riskY + 10)
      } else {
        ctx.fillText(title, riskX, riskY)
      }
    }
  }, [analysisData, risks])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} width={500} height={300} className="w-full h-auto max-h-[300px]" />
    </div>
  )
}

