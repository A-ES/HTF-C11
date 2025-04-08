"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Lightbulb,
  RefreshCw,
  Truck,
  Users,
  Zap,
} from "lucide-react"
import { ResourceChart } from "@/components/resource-chart"
import { useProjectData } from "@/context/project-data-context"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function OptimizationRecommendations() {
  const { analysisData } = useProjectData()
  const { toast } = useToast()
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [implementedRecommendations, setImplementedRecommendations] = useState<Record<string, boolean>>({})
  const [implementing, setImplementing] = useState<string | null>(null)

  // Extract recommendations from analysis data
  const resourceRecommendations = [
    ...(analysisData?.resourceOptimization?.labor?.recommendations || []),
    ...(analysisData?.resourceOptimization?.materials?.recommendations || []),
    ...(analysisData?.resourceOptimization?.equipment?.recommendations || []),
  ]

  const environmentalRecommendations = analysisData?.environmentalImpact?.recommendations || []
  const scheduleRecommendations = analysisData?.scheduleOptimization?.criticalPathChanges || []
  const budgetRecommendations = analysisData?.budgetAnalysis?.recommendations || []

  // Combine all recommendations
  const allRecommendations = [
    ...resourceRecommendations,
    ...environmentalRecommendations,
    ...scheduleRecommendations,
    ...budgetRecommendations,
  ]

  // Calculate implementation status
  const totalRecommendations = allRecommendations.length
  const implementedCount = Object.keys(implementedRecommendations).filter(
    (key) => implementedRecommendations[key],
  ).length
  const implementationPercentage =
    totalRecommendations > 0 ? Math.round((implementedCount / totalRecommendations) * 100) : 0

  // Count recommendations by status
  const completedCount = implementedCount
  const inProgressCount = 3
  const plannedCount = 2
  const notStartedCount = totalRecommendations - completedCount - inProgressCount - plannedCount

  // Generate optimization impact data
  const optimizationImpactData = generateOptimizationImpactData(analysisData, implementedRecommendations)

  // Generate optimization categories data
  const optimizationCategoriesData = generateOptimizationCategoriesData(allRecommendations)

  // Handle recalculate
  const handleRecalculate = () => {
    setIsRecalculating(true)

    // Simulate recalculation process
    setTimeout(() => {
      setIsRecalculating(false)
      toast({
        title: "Optimizations Recalculated",
        description: "Updated calculations based on the latest project data.",
      })
    }, 2000)
  }

  // Handle implement recommendation
  const handleImplementRecommendation = async (recommendation: any) => {
    const key = `${recommendation.id}-${recommendation.title}`

    // Check if already implemented
    if (implementedRecommendations[key]) {
      toast({
        title: "Already Implemented",
        description: `${recommendation.title} has already been implemented.`,
      })
      return
    }

    // Set implementing state to show loading
    setImplementing(key)

    // Simulate implementation process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update implemented state
    setImplementedRecommendations((prev) => ({
      ...prev,
      [key]: true,
    }))

    // Show success toast
    toast({
      title: "Recommendation Implemented",
      description: `Successfully implemented: ${recommendation.title}`,
    })

    // Reset implementing state
    setImplementing(null)
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Optimization Recommendations</h2>
          <p className="text-muted-foreground">AI-generated suggestions to improve project efficiency</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRecalculate} disabled={isRecalculating}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRecalculating ? "animate-spin" : ""}`} />
            {isRecalculating ? "Recalculating..." : "Recalculate"}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Optimization Impact</CardTitle>
            <CardDescription>Potential improvements by implementing recommendations</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResourceChart type="bar" resourceType="materials" data={optimizationImpactData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Implementation Status</CardTitle>
              <Badge>{totalRecommendations} Recommendations</Badge>
            </div>
            <CardDescription>Progress on implementing optimization suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Implemented</span>
                  <span className="text-sm font-medium">
                    {implementedCount}/{totalRecommendations}
                  </span>
                </div>
                <Progress value={implementationPercentage} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <div className="text-2xl font-bold">{completedCount}</div>
                </div>

                <div className="rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">In Progress</span>
                  </div>
                  <div className="text-2xl font-bold">{inProgressCount}</div>
                </div>

                <div className="rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Planned</span>
                  </div>
                  <div className="text-2xl font-bold">{plannedCount}</div>
                </div>

                <div className="rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Not Started</span>
                  </div>
                  <div className="text-2xl font-bold">{notStartedCount}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Optimization Categories</CardTitle>
            <CardDescription>Distribution of recommendations by type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResourceChart type="pie" resourceType="equipment" data={optimizationCategoriesData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Recommendations</CardTitle>
          <CardDescription>Highest impact optimization suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allRecommendations
              .filter((rec) => rec.impact === "High")
              .slice(0, 3)
              .map((recommendation, index) => {
                const key = `${recommendation.id}-${recommendation.title}`
                const isImplemented = implementedRecommendations[key]
                const isImplementing = implementing === key

                return (
                  <div key={key} className="flex items-start gap-4 rounded-md border p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                      {index === 0 ? (
                        <Users className="h-4 w-4" />
                      ) : index === 1 ? (
                        <Truck className="h-4 w-4" />
                      ) : (
                        <DollarSign className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{recommendation.title}</h4>
                        <Badge className="bg-green-500">High Impact</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {index === 0 ? "Resource" : index === 1 ? "Schedule" : "Budget"}
                          </Badge>
                          {recommendation.savingsEstimate && (
                            <Badge variant="outline">Savings: {recommendation.savingsEstimate}</Badge>
                          )}
                          {recommendation.carbonReduction && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                              -{recommendation.carbonReduction}
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleImplementRecommendation(recommendation)}
                          disabled={isImplemented || isImplementing}
                        >
                          {isImplementing ? (
                            <>
                              <Clock className="mr-2 h-4 w-4 animate-spin" />
                              Implementing...
                            </>
                          ) : isImplemented ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Implemented
                            </>
                          ) : (
                            <>
                              Implement
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}

            {allRecommendations.length === 0 && (
              <div className="flex items-start gap-4 rounded-md border p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">No recommendations available</h4>
                    <Badge className="bg-amber-500">Data Needed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload more detailed project data to generate optimization recommendations.
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Data</Badge>
                    </div>
                    <Button size="sm">
                      Upload Data
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Schedule Optimization</TabsTrigger>
          <TabsTrigger value="resource">Resource Optimization</TabsTrigger>
          <TabsTrigger value="budget">Budget Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Path Analysis</CardTitle>
              <CardDescription>AI-optimized project timeline with critical path highlighted</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Interactive Gantt chart would be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Showing optimized schedule with {analysisData?.scheduleOptimization?.timelineReduction || "8%"}{" "}
                  reduction in project duration
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resource" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Leveling</CardTitle>
              <CardDescription>Optimized resource allocation to prevent bottlenecks</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResourceChart type="bar" resourceType="labor" data={generateResourceLevelingData(analysisData)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Optimization</CardTitle>
              <CardDescription>Potential savings by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResourceChart type="bar" resourceType="equipment" data={generateCostOptimizationData(analysisData)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper function to generate optimization impact data
function generateOptimizationImpactData(analysisData: any, implementedRecommendations: Record<string, boolean>) {
  if (!analysisData) {
    return [
      { name: "Timeline", current: 100, optimized: 92 },
      { name: "Budget", current: 100, optimized: 94 },
      { name: "Resources", current: 100, optimized: 85 },
      { name: "Carbon", current: 100, optimized: 78 },
    ]
  }

  // Calculate potential timeline reduction
  const timelineReduction = analysisData.scheduleOptimization?.timelineReduction || "5%"
  const timelinePercentage = Number.parseInt(timelineReduction) || 8

  // Calculate potential budget savings
  const budgetMetrics = analysisData.budgetAnalysis || {}
  const totalBudget = analysisData.projectMetrics?.totalBudget || 0
  const potentialSavings =
    budgetMetrics.recommendations?.reduce((sum: number, rec: any) => {
      const savingsMatch = rec.savingsEstimate?.match(/\$([,\d]+)/)
      return sum + (savingsMatch ? Number.parseInt(savingsMatch[1].replace(/,/g, "")) : 0)
    }, 0) || 0

  const budgetPercentage = totalBudget > 0 ? Math.round((potentialSavings / totalBudget) * 100) : 6

  // Calculate potential resource optimization
  const resourcePercentage = 15

  // Calculate potential carbon reduction
  const environmentalMetrics = analysisData.environmentalImpact || {}
  const totalCarbon = environmentalMetrics.currentFootprint?.carbon || 0
  const potentialReduction =
    environmentalMetrics.recommendations?.reduce((sum: number, rec: any) => {
      const match = rec.carbonReduction?.match(/(\d+)/)
      return sum + (match ? Number.parseInt(match[1]) : 0)
    }, 0) || 0

  const carbonPercentage = totalCarbon > 0 ? Math.round((potentialReduction / totalCarbon) * 100) : 22

  // Calculate implementation effect
  const implementedCount = Object.keys(implementedRecommendations).filter(
    (key) => implementedRecommendations[key],
  ).length
  const totalRecommendations = [
    ...(analysisData.resourceOptimization?.labor?.recommendations || []),
    ...(analysisData.resourceOptimization?.materials?.recommendations || []),
    ...(analysisData.resourceOptimization?.equipment?.recommendations || []),
    ...(analysisData.environmentalImpact?.recommendations || []),
    ...(analysisData.scheduleOptimization?.criticalPathChanges || []),
    ...(analysisData.budgetAnalysis?.recommendations || []),
  ].length

  const implementationFactor = totalRecommendations > 0 ? implementedCount / totalRecommendations : 0

  return [
    {
      name: "Timeline",
      current: 100,
      optimized: 100 - Math.round(timelinePercentage * implementationFactor),
    },
    {
      name: "Budget",
      current: 100,
      optimized: 100 - Math.round(budgetPercentage * implementationFactor),
    },
    {
      name: "Resources",
      current: 100,
      optimized: 100 - Math.round(resourcePercentage * implementationFactor),
    },
    {
      name: "Carbon",
      current: 100,
      optimized: 100 - Math.round(carbonPercentage * implementationFactor),
    },
  ]
}

// Helper function to generate optimization categories data
function generateOptimizationCategoriesData(recommendations: any[]) {
  if (!recommendations || recommendations.length === 0) {
    return [
      { name: "Schedule", value: 4 },
      { name: "Resource", value: 3 },
      { name: "Budget", value: 2 },
      { name: "Process", value: 2 },
      { name: "Environmental", value: 1 },
    ]
  }

  // Count recommendations by category
  const categories: Record<string, number> = {}

  recommendations.forEach((rec) => {
    // Try to determine category from recommendation properties
    let category = "Other"

    if (rec.task) {
      category = "Schedule"
    } else if (rec.carbonReduction) {
      category = "Environmental"
    } else if (rec.savingsEstimate) {
      category = "Budget"
    } else if (rec.title) {
      const title = rec.title.toLowerCase()
      if (title.includes("labor") || title.includes("resource") || title.includes("equipment")) {
        category = "Resource"
      } else if (title.includes("schedule") || title.includes("timeline")) {
        category = "Schedule"
      } else if (title.includes("budget") || title.includes("cost")) {
        category = "Budget"
      } else if (title.includes("process") || title.includes("workflow")) {
        category = "Process"
      } else if (title.includes("carbon") || title.includes("environmental")) {
        category = "Environmental"
      }
    }

    categories[category] = (categories[category] || 0) + 1
  })

  // Convert to chart data format
  return Object.entries(categories).map(([name, value]) => ({ name, value }))
}

// Helper function to generate resource leveling data
function generateResourceLevelingData(analysisData: any) {
  if (!analysisData || !analysisData.projectData) {
    return Array.from({ length: 6 }, (_, i) => ({
      name: `Week ${i + 1}`,
      current: 35 + i * 3 + Math.floor(Math.random() * 5),
      optimized: 32 + i * 2 + Math.floor(Math.random() * 3),
    }))
  }

  const labor = analysisData.projectData.labor || []
  const schedule = analysisData.projectData.schedule || []

  // Calculate total labor count
  const totalLabor = labor.reduce((sum: number, l: any) => sum + (l.count || 0), 0)

  // Generate weekly labor requirements
  return Array.from({ length: 6 }, (_, i) => {
    // Calculate base labor requirement
    const baseLabor = totalLabor > 0 ? Math.round(totalLabor * (0.7 + i * 0.05)) : 35 + i * 3

    // Add some randomness
    const current = baseLabor + Math.floor(Math.random() * 5)

    // Calculate optimized value (smoother curve)
    const optimized = Math.round(baseLabor * 0.95) + Math.floor(Math.random() * 3)

    return {
      name: `Week ${i + 1}`,
      current,
      optimized,
    }
  })
}

// Helper function to generate cost optimization data
function generateCostOptimizationData(analysisData: any) {
  if (!analysisData) {
    return [
      { name: "Materials", current: 850000, optimized: 820000 },
      { name: "Labor", current: 650000, optimized: 625000 },
      { name: "Equipment", current: 250000, optimized: 195000 },
      { name: "Overhead", current: 150000, optimized: 140000 },
    ]
  }

  const materialCost = analysisData.projectMetrics?.totalMaterialCost || 0
  const laborCost = analysisData.projectMetrics?.totalLaborCost || 0
  const equipmentCost = analysisData.projectMetrics?.totalEquipmentCost || 0

  // Calculate overhead as 10% of total direct costs
  const directCosts = materialCost + laborCost + equipmentCost
  const overhead = directCosts * 0.1

  // Calculate potential savings percentages
  const materialSavings = 0.035 // 3.5%
  const laborSavings = 0.04 // 4%
  const equipmentSavings = 0.22 // 22%
  const overheadSavings = 0.07 // 7%

  return [
    {
      name: "Materials",
      current: materialCost,
      optimized: Math.round(materialCost * (1 - materialSavings)),
    },
    {
      name: "Labor",
      current: laborCost,
      optimized: Math.round(laborCost * (1 - laborSavings)),
    },
    {
      name: "Equipment",
      current: equipmentCost,
      optimized: Math.round(equipmentCost * (1 - equipmentSavings)),
    },
    {
      name: "Overhead",
      current: overhead,
      optimized: Math.round(overhead * (1 - overheadSavings)),
    },
  ]
}

