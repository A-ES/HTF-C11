"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowRight, Calendar, Download, RefreshCw, TrendingDown, Zap } from "lucide-react"
import { ResourceChart } from "@/components/resource-chart"
import { useProjectData } from "@/context/project-data-context"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function PredictiveAnalytics() {
  const { analysisData } = useProjectData()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  // Extract data from analysis
  const scheduleData = analysisData?.scheduleOptimization || {}
  const budgetData = analysisData?.budgetAnalysis || {}
  const riskData = analysisData?.riskAssessment || []
  const projectMetrics = analysisData?.projectMetrics || {}

  // Format dates
  const predictedCompletionDate = scheduleData.optimizedCompletion
    ? new Date(scheduleData.optimizedCompletion).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Aug 25, 2024"

  const originalCompletionDate = scheduleData.currentCompletion
    ? new Date(scheduleData.currentCompletion).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Aug 30, 2024"

  // Calculate if ahead or behind schedule
  const isAheadOfSchedule = scheduleData.timelineReduction && scheduleData.timelineReduction.includes("days")

  // Calculate budget status
  const budgetStatus = budgetData.variance > 0 ? "Under Budget" : "Over Budget"
  const budgetVariance = Math.abs(budgetData.variance || 50000)

  // Get resource bottlenecks
  const resourceBottlenecks = [
    ...(analysisData?.resourceOptimization?.labor?.bottlenecks || []),
    ...(analysisData?.resourceOptimization?.materials?.bottlenecks || []),
    ...(analysisData?.resourceOptimization?.equipment?.bottlenecks || []),
  ]

  const bottleneckCount = resourceBottlenecks.length
  const bottleneckStatus = bottleneckCount > 2 ? "Critical" : bottleneckCount > 0 ? "Attention Needed" : "On Track"
  const bottleneckDescription =
    resourceBottlenecks.length > 0
      ? resourceBottlenecks
          .slice(0, 2)
          .map((b) => b.name)
          .join(" and ")
      : "No major bottlenecks"

  // Calculate AI confidence based on data completeness
  const dataCompleteness = calculateDataCompleteness(analysisData)
  const aiConfidence = Math.min(95, Math.max(70, Math.round(dataCompleteness * 100)))

  // Generate material demand forecast data
  const materialDemandForecast = generateMaterialDemandForecast(analysisData)

  // Generate labor requirement forecast data
  const laborRequirementForecast = generateLaborRequirementForecast(analysisData)

  // Handle update predictions
  const handleUpdatePredictions = () => {
    setIsUpdating(true)

    // Simulate update process
    setTimeout(() => {
      setIsUpdating(false)
      toast({
        title: "Predictions Updated",
        description: "AI has recalculated predictions based on the latest data.",
      })
    }, 2000)
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Predictive Analytics</h2>
          <p className="text-muted-foreground">AI-powered forecasts and predictions for project resources</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleUpdatePredictions} disabled={isUpdating}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
            {isUpdating ? "Updating..." : "Update Predictions"}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Completion</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictedCompletionDate}</div>
            <div className="flex items-center mt-2">
              <Badge className={isAheadOfSchedule ? "bg-green-500" : "bg-amber-500"}>
                {isAheadOfSchedule ? "Ahead of Schedule" : "On Target"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isAheadOfSchedule ? scheduleData.timelineReduction : "On track"} compared to original plan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Forecast</CardTitle>
            <TrendingDown
              className={`h-4 w-4 ${budgetStatus === "Under Budget" ? "text-green-500" : "text-red-500"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(budgetData.forecast || 0).toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <Badge className={budgetStatus === "Under Budget" ? "bg-green-500" : "bg-red-500"}>{budgetStatus}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ${budgetVariance.toLocaleString()} {budgetStatus.toLowerCase()} original estimate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resource Bottlenecks</CardTitle>
            <AlertTriangle
              className={`h-4 w-4 ${
                bottleneckStatus === "Critical"
                  ? "text-red-500"
                  : bottleneckStatus === "Attention Needed"
                    ? "text-amber-500"
                    : "text-green-500"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bottleneckCount} Identified</div>
            <div className="flex items-center mt-2">
              <Badge
                className={
                  bottleneckStatus === "Critical"
                    ? "bg-red-500"
                    : bottleneckStatus === "Attention Needed"
                      ? "bg-amber-500"
                      : "bg-green-500"
                }
              >
                {bottleneckStatus}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{bottleneckDescription}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiConfidence}%</div>
            <div className="flex items-center mt-2">
              <Badge
                className={aiConfidence > 90 ? "bg-green-500" : aiConfidence > 80 ? "bg-blue-500" : "bg-amber-500"}
              >
                {aiConfidence > 90 ? "High Confidence" : aiConfidence > 80 ? "Good Confidence" : "Moderate Confidence"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on {Math.round(dataCompleteness * 100)}% data completeness
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Material Demand Forecast</CardTitle>
            <CardDescription>Predicted material requirements for next 8 weeks</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResourceChart type="line" resourceType="materials" data={materialDemandForecast} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Labor Requirement Forecast</CardTitle>
            <CardDescription>Predicted workforce needs by skill category</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResourceChart type="bar" resourceType="labor" data={laborRequirementForecast} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Identified Risk Factors</CardTitle>
          <CardDescription>Potential issues that may impact project timeline or budget</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskData.slice(0, 3).map((risk: any, index: number) => (
              <div key={risk.id || index} className="flex items-start gap-4 rounded-md border p-4">
                <AlertTriangle
                  className={`mt-0.5 h-5 w-5 ${
                    risk.severity === "Critical"
                      ? "text-red-500"
                      : risk.severity === "High"
                        ? "text-amber-500"
                        : "text-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{risk.title}</h4>
                    <Badge
                      className={
                        risk.severity === "Critical"
                          ? "bg-red-500"
                          : risk.severity === "High"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      }
                    >
                      {risk.severity} Risk
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                  <div className="mt-2 flex items-center text-sm text-blue-500">
                    <Button variant="link" className="h-auto p-0 text-blue-500">
                      View mitigation plan
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {riskData.length === 0 && (
              <div className="flex items-start gap-4 rounded-md border p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">No risk data available</h4>
                    <Badge className="bg-amber-500">Medium Risk</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    No risk data was provided in the project information. Consider adding risk assessments for better
                    predictions.
                  </p>
                  <div className="mt-2 flex items-center text-sm text-blue-500">
                    <Button variant="link" className="h-auto p-0 text-blue-500">
                      Add risk assessment
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
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

// Helper function to calculate data completeness
function calculateDataCompleteness(analysisData: any) {
  if (!analysisData) return 0.7

  const dataPoints = [
    analysisData.projectData?.materials?.length > 0,
    analysisData.projectData?.labor?.length > 0,
    analysisData.projectData?.equipment?.length > 0,
    analysisData.projectData?.schedule?.length > 0,
    analysisData.projectData?.risks?.length > 0,
    analysisData.projectData?.sustainability !== undefined,
    analysisData.projectData?.budget !== undefined,
    analysisData.projectData?.startDate !== undefined,
    analysisData.projectData?.endDate !== undefined,
    analysisData.projectData?.projectType !== undefined,
  ]

  const completedPoints = dataPoints.filter(Boolean).length
  return completedPoints / dataPoints.length
}

// Helper function to generate material demand forecast
function generateMaterialDemandForecast(analysisData: any) {
  if (!analysisData || !analysisData.projectData) {
    return Array.from({ length: 8 }, (_, i) => ({
      name: `Week ${i + 1}`,
      value: 75 + Math.floor(Math.random() * 70),
    }))
  }

  const materials = analysisData.projectData.materials || []
  const schedule = analysisData.projectData.schedule || []

  // If we have schedule data, use it to model material demand
  if (schedule.length > 0) {
    // Calculate total project duration
    const startDates = schedule.map((phase) => new Date(phase.startDate).getTime())
    const endDates = schedule.map((phase) => new Date(phase.endDate).getTime())
    const projectStart = Math.min(...startDates)
    const projectEnd = Math.max(...endDates)
    const totalDuration = (projectEnd - projectStart) / (7 * 24 * 60 * 60 * 1000) // in weeks

    // Generate 8 weeks of forecast data
    return Array.from({ length: 8 }, (_, i) => {
      // Calculate where in the project timeline this week falls
      const projectProgress = Math.min(1, (i + 1) / totalDuration)

      // Model a bell curve for material demand
      let demandFactor
      if (projectProgress < 0.2) {
        // Ramp up phase
        demandFactor = projectProgress * 5
      } else if (projectProgress < 0.7) {
        // Peak demand phase
        demandFactor = 1
      } else {
        // Ramp down phase
        demandFactor = 1 - (projectProgress - 0.7) / 0.3
      }

      // Calculate base demand from materials data
      const baseDemand =
        materials.length > 0 ? materials.reduce((sum, m) => sum + (m.quantity || 0) * (m.unitCost || 1), 0) / 10000 : 75

      // Apply demand factor and add some randomness
      const value = Math.max(10, Math.round(baseDemand * demandFactor * (0.9 + Math.random() * 0.2)))

      return {
        name: `Week ${i + 1}`,
        value,
      }
    })
  }

  // Fallback to random data with a realistic curve
  return Array.from({ length: 8 }, (_, i) => {
    // Create a realistic curve that rises, plateaus, then falls
    let value
    if (i < 3) {
      value = 75 + i * 15 + Math.floor(Math.random() * 10)
    } else if (i < 6) {
      value =
        120 +
        Math.floor(Math.random() * 20) +
        Math.floor(Math.random() * 10)
    } else if (i < 6) {
      value = 120 + Math.floor(Math.random() * 20)
    } else {
      value = 120 - (i - 5) * 15 + Math.floor(Math.random() * 10)
    }

    return {
      name: `Week ${i + 1}`,
      value,
    }
  })
}

// Helper function to generate labor requirement forecast
function generateLaborRequirementForecast(analysisData: any) {
  if (!analysisData || !analysisData.projectData) {
    return Array.from({ length: 6 }, (_, i) => ({
      name: `Week ${i + 1}`,
      general: 25 + Math.floor(Math.random() * 10),
      skilled: 15 + Math.floor(Math.random() * 10),
      specialized: 5 + Math.floor(Math.random() * 5),
    }))
  }

  const labor = analysisData.projectData.labor || []
  const schedule = analysisData.projectData.schedule || []

  // Calculate labor categories
  const generalLabor = labor.filter((l) => (l.hourlyRate || 0) < 30).reduce((sum, l) => sum + (l.count || 0), 0)
  const skilledLabor = labor
    .filter((l) => (l.hourlyRate || 0) >= 30 && (l.hourlyRate || 0) < 45)
    .reduce((sum, l) => sum + (l.count || 0), 0)
  const specializedLabor = labor.filter((l) => (l.hourlyRate || 0) >= 45).reduce((sum, l) => sum + (l.count || 0), 0)

  // If we have schedule data, use it to model labor requirements
  if (schedule.length > 0) {
    // Calculate total project duration
    const startDates = schedule.map((phase) => new Date(phase.startDate).getTime())
    const endDates = schedule.map((phase) => new Date(phase.endDate).getTime())
    const projectStart = Math.min(...startDates)
    const projectEnd = Math.max(...endDates)
    const totalDuration = (projectEnd - projectStart) / (7 * 24 * 60 * 60 * 1000) // in weeks

    // Generate 6 weeks of forecast data
    return Array.from({ length: 6 }, (_, i) => {
      // Calculate where in the project timeline this week falls
      const projectProgress = Math.min(1, (i + 1) / totalDuration)

      // Model different curves for different labor types
      const generalFactor = Math.min(1, 2 * projectProgress * (1 - projectProgress) + 0.5) // Bell curve with minimum 0.5
      const skilledFactor = Math.min(1, 1.5 * Math.pow(projectProgress, 0.7)) // Rises and plateaus
      const specializedFactor = Math.min(1, 2 * Math.pow(projectProgress, 1.5)) // Rises later

      // Calculate base values from labor data
      const baseGeneral = generalLabor > 0 ? generalLabor : 25
      const baseSkilled = skilledLabor > 0 ? skilledLabor : 15
      const baseSpecialized = specializedLabor > 0 ? specializedLabor : 5

      // Apply factors and add some randomness
      const general = Math.max(5, Math.round(baseGeneral * generalFactor * (0.9 + Math.random() * 0.2)))
      const skilled = Math.max(3, Math.round(baseSkilled * skilledFactor * (0.9 + Math.random() * 0.2)))
      const specialized = Math.max(1, Math.round(baseSpecialized * specializedFactor * (0.9 + Math.random() * 0.2)))

      return {
        name: `Week ${i + 1}`,
        general,
        skilled,
        specialized,
      }
    })
  }

  // Fallback to realistic curve data
  return Array.from({ length: 6 }, (_, i) => {
    // Create realistic curves for different labor types
    const general = 25 + Math.floor(i * 2) + Math.floor(Math.random() * 5)
    const skilled = 15 + Math.floor(i * 2.5) + Math.floor(Math.random() * 4)
    const specialized = 5 + Math.floor(i * 1.5) + Math.floor(Math.random() * 3)

    return {
      name: `Week ${i + 1}`,
      general: i < 4 ? general : general - 5,
      skilled: skilled,
      specialized: i < 2 ? specialized - 2 : specialized,
    }
  })
}

