document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle")
  const body = document.body

  themeToggle.addEventListener("click", () => {
    if (body.classList.contains("dark-theme")) {
      body.classList.remove("dark-theme")
      body.classList.add("light-theme")
      localStorage.setItem("theme", "light")
    } else {
      body.classList.remove("light-theme")
      body.classList.add("dark-theme")
      localStorage.setItem("theme", "dark")
    }
  })

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    body.classList.remove("light-theme")
    body.classList.add("dark-theme")
  } else {
    body.classList.remove("dark-theme")
    body.classList.add("light-theme")
  }

  // Tab switching functionality
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.getAttribute("data-tab")

      // Update active tab button
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Show selected tab content
      tabContents.forEach((content) => {
        content.classList.remove("active")
        if (content.id === tabName) {
          content.classList.add("active")
        }
      })
    })
  })

  // Draw risk flow diagram
  drawRiskFlowDiagram()
})

// Function to draw the risk flow diagram
function drawRiskFlowDiagram() {
  const canvas = document.getElementById("riskCanvas")
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

  // Define risks
  const risks = [
    { title: "Weather Risk", severity: "Medium" },
    { title: "Supply Chain", severity: "High" },
    { title: "Labor Shortage", severity: "Medium" },
  ]

  // Draw risk nodes around the project
  const riskCount = risks.length
  const radius = Math.min(width, height) / 2 - 60

  for (let i = 0; i < riskCount; i++) {
    const risk = risks[i]
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
    const title = risk.title
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
}

// Handle window resize for responsive canvas
window.addEventListener("resize", () => {
  drawRiskFlowDiagram()
})

