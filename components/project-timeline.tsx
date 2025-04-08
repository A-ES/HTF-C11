"use client"

import { CheckCircle2, Circle, Clock, AlertTriangle } from "lucide-react"
import { useProjectData } from "@/context/project-data-context"

export function ProjectTimeline() {
  const { analysisData } = useProjectData()

  // Extract schedule data from analysis
  const schedule = analysisData?.projectData?.schedule || []

  // If no schedule data is available, use the default timeline data
  const timelineData =
    schedule.length > 0
      ? schedule.map((phase: any) => ({
          id: phase.id,
          title: phase.phase,
          date: `${new Date(phase.startDate).toLocaleDateString()} - ${new Date(phase.endDate).toLocaleDateString()}`,
          status: determineStatus(phase.startDate, phase.endDate),
          description: phase.description || `${phase.phase} phase of the project`,
          risk: phase.risk || null,
        }))
      : [
          {
            id: 1,
            title: "Foundation Work",
            date: "Jan 15 - Feb 28, 2024",
            status: "completed",
            description: "Excavation and concrete foundation completed",
          },
          {
            id: 2,
            title: "Structural Framework",
            date: "Mar 1 - Apr 15, 2024",
            status: "completed",
            description: "Steel framework and primary structure assembly",
          },
          {
            id: 3,
            title: "Electrical & Plumbing",
            date: "Apr 16 - May 30, 2024",
            status: "in-progress",
            description: "Installation of electrical wiring and plumbing systems",
          },
          {
            id: 4,
            title: "Interior Construction",
            date: "Jun 1 - Jul 15, 2024",
            status: "upcoming",
            description: "Walls, flooring, and interior fixtures",
          },
          {
            id: 5,
            title: "Finishing & Inspection",
            date: "Jul 16 - Aug 30, 2024",
            status: "upcoming",
            description: "Final touches and regulatory inspections",
            risk: "Potential delay due to inspector availability",
          },
        ]

  return (
    <div className="relative space-y-4 before:absolute before:inset-0 before:left-9 before:ml-px before:h-full before:w-px before:bg-border">
      {timelineData.map((item) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center">
            {item.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {item.status === "in-progress" && <Clock className="h-5 w-5 text-blue-500" />}
            {item.status === "upcoming" && <Circle className="h-5 w-5 text-muted-foreground" />}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{item.title}</h3>
              {item.risk && <AlertTriangle className="h-4 w-4 text-amber-500" />}
            </div>
            <p className="text-sm text-muted-foreground">{item.date}</p>
            <p className="text-sm">{item.description}</p>
            {item.risk && <p className="text-sm text-amber-500">{item.risk}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

// Helper function to determine the status of a phase based on start and end dates
function determineStatus(startDate: string, endDate: string) {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (now > end) return "completed"
  if (now >= start && now <= end) return "in-progress"
  return "upcoming"
}

