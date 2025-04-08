"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Clock, DollarSign, Users } from "lucide-react"
import { ProjectTimeline } from "@/components/project-timeline"
import { useProjectData } from "@/context/project-data-context"
import { RiskFlowDiagram } from "@/components/risk-flow-diagram"

export function ProjectOverview() {
  const { analysisData } = useProjectData()

  // Extract metrics from analysis data
  const projectMetrics = analysisData?.projectMetrics || {}
  const environmentalImpact = analysisData?.environmentalImpact?.currentFootprint || {}
  const riskAssessment = analysisData?.riskAssessment || []

  // Calculate total cost
  const totalCost =
    (projectMetrics.totalMaterialCost || 0) +
    (projectMetrics.totalLaborCost || 0) +
    (projectMetrics.totalEquipmentCost || 0)

  // Calculate budget utilization
  const budgetUtilization = projectMetrics.totalBudget ? Math.round((totalCost / projectMetrics.totalBudget) * 100) : 66

  // Determine if under/over budget
  const budgetStatus =
    budgetUtilization <= 100
      ? `Under budget by ${(100 - budgetUtilization).toFixed(1)}%`
      : `Over budget by ${(budgetUtilization - 100).toFixed(1)}%`

  // Time efficiency calculation
  const timeEfficiency = 94 // Default value
  const timeStatus = projectMetrics.projectDuration
    ? (projectMetrics.completionPercentage || 0) > projectMetrics.projectDuration / 2
      ? "On Schedule"
      : "Ahead of Schedule"
    : "On Schedule"

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Project Completion</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projectMetrics.completionPercentage || 68}%</div>
          <Progress value={projectMetrics.completionPercentage || 68} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">+2.5% from last week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${Number(totalCost).toLocaleString()} / ${Number(projectMetrics.totalBudget || 0).toLocaleString()}
          </div>
          <Progress value={budgetUtilization} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">{budgetStatus}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time Efficiency</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{timeEfficiency}%</div>
          <div className="flex items-center mt-2">
            <Badge className="bg-green-500">{timeStatus}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {analysisData?.scheduleOptimization?.timelineReduction || "2 days"} ahead of schedule
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">87%</div>
          <Progress value={87} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">+5% from optimal target</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
          <CardDescription>Current progress and upcoming milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectTimeline />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>AI-identified potential risks and mitigation strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <RiskFlowDiagram />
          </div>
          <div className="space-y-4">
            {riskAssessment.length > 0 ? (
              riskAssessment.slice(0, 2).map((risk: any) => (
                <div key={risk.id} className="flex items-start gap-4 rounded-md border p-4">
                  <AlertTriangle
                    className={`mt-0.5 h-5 w-5 ${
                      risk.severity === "Critical"
                        ? "text-red-500"
                        : risk.severity === "High"
                          ? "text-amber-500"
                          : "text-blue-500"
                    }`}
                  />
                  <div>
                    <h4 className="font-semibold">{risk.title}</h4>
                    <p className="text-sm text-muted-foreground">{risk.description}</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="mr-1">
                        {risk.severity} Risk
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`
                        ${
                          risk.severity === "Critical"
                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                            : risk.severity === "High"
                              ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                              : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                        }
                      `}
                      >
                        Mitigation Required
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-start gap-4 rounded-md border p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                <div>
                  <h4 className="font-semibold">Material Delivery Delay</h4>
                  <p className="text-sm text-muted-foreground">
                    Concrete supplier has reported potential delays due to transportation issues.
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="mr-1">
                      High Risk
                    </Badge>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
                      Mitigation Required
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

