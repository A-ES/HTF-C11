"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Brain, Lightbulb, Zap, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { useProjectData } from "@/context/project-data-context"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { ImplementationTracker } from "@/components/implementation-tracker"
import { AIAnalyzer } from "@/components/ai-analyzer"

export function AIInsights() {
  const { analysisData } = useProjectData()
  const [isLoading, setIsLoading] = useState(true)
  const [activeInsight, setActiveInsight] = useState<any>(null)
  const [implementedInsights, setImplementedInsights] = useState<Record<string, boolean>>({})
  const [implementing, setImplementing] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate AI processing time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <AIInsightsSkeleton />
  }

  // Check if we have valid analysis data
  if (!analysisData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No Analysis Data Available</h3>
        <p className="text-muted-foreground mb-6">
          Please upload project data to generate AI insights and recommendations.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Upload Project Data
        </Button>
      </div>
    )
  }

  const resourceRecommendations = [
    ...(analysisData?.resourceOptimization?.labor?.recommendations || []),
    ...(analysisData?.resourceOptimization?.materials?.recommendations || []),
    ...(analysisData?.resourceOptimization?.equipment?.recommendations || []),
  ]

  const environmentalRecommendations = analysisData?.environmentalImpact?.recommendations || []
  const riskAssessments = analysisData?.riskAssessment || []
  const scheduleOptimizations = analysisData?.scheduleOptimization?.criticalPathChanges || []

  const handleInsightClick = (insight: any) => {
    setActiveInsight(insight)
  }

  const handleImplementRecommendation = async (insight: any) => {
    // Check if already implemented
    if (implementedInsights[`${insight.id}-${insight.title}`]) {
      toast({
        title: "Already Implemented",
        description: `${insight.title} has already been implemented.`,
      })
      return
    }

    // Set implementing state to show loading
    setImplementing(`${insight.id}-${insight.title}`)

    // Simulate implementation process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update implemented state
    setImplementedInsights((prev) => ({
      ...prev,
      [`${insight.id}-${insight.title}`]: true,
    }))

    // Show success toast
    toast({
      title: "Recommendation Implemented",
      description: `Successfully implemented: ${insight.title}`,
    })

    // Reset implementing state
    setImplementing(null)
  }

  // Project metrics for summary
  const projectMetrics = analysisData?.projectMetrics || {}

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <Brain className="mr-2 h-5 w-5 text-blue-500" />
            AI Insights & Recommendations
          </h2>
          <p className="text-muted-foreground">Machine learning-powered analysis and optimization suggestions</p>
        </div>
      </div>

      {/* Project Summary Card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Project Analysis Summary</CardTitle>
          <CardDescription>Key metrics and optimization potential</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-md border p-4">
              <p className="text-sm font-medium text-muted-foreground">Budget</p>
              <p className="text-2xl font-bold">${Number(projectMetrics.totalBudget || 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Current spend: $
                {Number(
                  (projectMetrics.totalMaterialCost || 0) +
                    (projectMetrics.totalLaborCost || 0) +
                    (projectMetrics.totalEquipmentCost || 0),
                ).toLocaleString()}
              </p>
            </div>

            <div className="rounded-md border p-4">
              <p className="text-sm font-medium text-muted-foreground">Completion</p>
              <p className="text-2xl font-bold">{projectMetrics.completionPercentage || 0}%</p>
              <p className="text-xs text-muted-foreground mt-1">Duration: {projectMetrics.projectDuration || 0} days</p>
            </div>

            <div className="rounded-md border p-4">
              <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
              <p className="text-2xl font-bold flex items-center">
                {projectMetrics.riskLevel || "Medium"}
                {projectMetrics.riskLevel === "High" && <AlertCircle className="ml-2 h-5 w-5 text-red-500" />}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{riskAssessments.length} identified risks</p>
            </div>

            <div className="rounded-md border p-4">
              <p className="text-sm font-medium text-muted-foreground">Carbon Footprint</p>
              <p className="text-2xl font-bold">
                {analysisData?.environmentalImpact?.currentFootprint?.carbon || 0} tons
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Potential reduction:{" "}
                {environmentalRecommendations.reduce((sum, rec) => {
                  const match = rec.carbonReduction?.match(/(\d+)/)
                  return sum + (match ? Number.parseInt(match[1]) : 0)
                }, 0)}{" "}
                tons
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Implementation Tracker */}
      <ImplementationTracker
        implementedInsights={implementedInsights}
        allInsights={[
          ...resourceRecommendations,
          ...environmentalRecommendations,
          ...riskAssessments,
          ...scheduleOptimizations,
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Tabs defaultValue="recommendations" className="space-y-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="analyzer">AI Analyzer</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              <Tabs defaultValue="resources" className="space-y-4">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="environmental">Environmental</TabsTrigger>
                  <TabsTrigger value="risks">Risks</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>

                <TabsContent value="resources" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Resource Optimization</CardTitle>
                      <CardDescription>AI-generated recommendations to optimize resource allocation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {resourceRecommendations.length > 0 ? (
                          resourceRecommendations.map((recommendation: any) => {
                            const insightKey = `${recommendation.id}-${recommendation.title}`
                            const isImplemented = implementedInsights[insightKey]
                            const isImplementing = implementing === insightKey

                            return (
                              <div
                                key={recommendation.id}
                                className={`flex items-start gap-4 rounded-md border p-4 cursor-pointer transition-colors ${
                                  activeInsight === recommendation
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                                    : isImplemented
                                      ? "border-green-500 bg-green-50/50 dark:bg-green-950/50"
                                      : "hover:bg-muted/50"
                                }`}
                                onClick={() => handleInsightClick(recommendation)}
                              >
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    isImplemented
                                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                                      : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                                  }`}
                                >
                                  {isImplemented ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <Lightbulb className="h-4 w-4" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">{recommendation.title}</h4>
                                    <Badge
                                      className={recommendation.impact === "High" ? "bg-green-500" : "bg-blue-500"}
                                    >
                                      {recommendation.impact} Impact
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                                  <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">Savings: {recommendation.savingsEstimate}</Badge>
                                      {recommendation.carbonReduction && (
                                        <Badge
                                          variant="outline"
                                          className="bg-green-500/10 text-green-600 dark:text-green-400"
                                        >
                                          -{recommendation.carbonReduction}
                                        </Badge>
                                      )}
                                    </div>
                                    {isImplementing && (
                                      <div className="flex items-center">
                                        <Clock className="mr-1 h-3 w-3 animate-pulse" />
                                        <span className="text-xs">Implementing...</span>
                                      </div>
                                    )}
                                    {isImplemented && (
                                      <div className="flex items-center text-green-600">
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        <span className="text-xs">Implemented</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8 text-center">
                            <p className="text-muted-foreground">No resource recommendations available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="environmental" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Environmental Impact</CardTitle>
                      <CardDescription>Sustainability recommendations to reduce carbon footprint</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {environmentalRecommendations.length > 0 ? (
                          environmentalRecommendations.map((recommendation: any) => {
                            const insightKey = `${recommendation.id}-${recommendation.title}`
                            const isImplemented = implementedInsights[insightKey]
                            const isImplementing = implementing === insightKey

                            return (
                              <div
                                key={recommendation.id}
                                className={`flex items-start gap-4 rounded-md border p-4 cursor-pointer transition-colors ${
                                  activeInsight === recommendation
                                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                                    : isImplemented
                                      ? "border-green-500 bg-green-50/50 dark:bg-green-950/50"
                                      : "hover:bg-muted/50"
                                }`}
                                onClick={() => handleInsightClick(recommendation)}
                              >
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    isImplemented
                                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                                      : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                                  }`}
                                >
                                  {isImplemented ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <Lightbulb className="h-4 w-4" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">{recommendation.title}</h4>
                                    <Badge
                                      className={recommendation.impact === "High" ? "bg-green-500" : "bg-blue-500"}
                                    >
                                      {recommendation.impact} Impact
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                                  <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className="bg-green-500/10 text-green-600 dark:text-green-400"
                                      >
                                        -{recommendation.carbonReduction}
                                      </Badge>
                                    </div>
                                    {isImplementing && (
                                      <div className="flex items-center">
                                        <Clock className="mr-1 h-3 w-3 animate-pulse" />
                                        <span className="text-xs">Implementing...</span>
                                      </div>
                                    )}
                                    {isImplemented && (
                                      <div className="flex items-center text-green-600">
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        <span className="text-xs">Implemented</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8 text-center">
                            <p className="text-muted-foreground">No environmental recommendations available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="risks" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Assessment</CardTitle>
                      <CardDescription>AI-identified potential risks and mitigation strategies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {riskAssessments.length > 0 ? (
                          riskAssessments.map((risk: any) => {
                            const insightKey = `${risk.id}-${risk.title}`
                            const isImplemented = implementedInsights[insightKey]
                            const isImplementing = implementing === insightKey

                            return (
                              <div
                                key={risk.id}
                                className={`flex items-start gap-4 rounded-md border p-4 cursor-pointer transition-colors ${
                                  activeInsight === risk
                                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
                                    : isImplemented
                                      ? "border-green-500 bg-green-50/50 dark:bg-green-950/50"
                                      : "hover:bg-muted/50"
                                }`}
                                onClick={() => handleInsightClick(risk)}
                              >
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    isImplemented
                                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                                      : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100"
                                  }`}
                                >
                                  {isImplemented ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <Lightbulb className="h-4 w-4" />
                                  )}
                                </div>
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
                                  <div className="mt-2">
                                    <p className="text-sm font-medium">Mitigation Strategy:</p>
                                    <p className="text-sm text-muted-foreground">{risk.mitigationStrategy}</p>
                                  </div>
                                  <div className="mt-2 flex items-center justify-between">
                                    {isImplementing && (
                                      <div className="flex items-center">
                                        <Clock className="mr-1 h-3 w-3 animate-pulse" />
                                        <span className="text-xs">Implementing...</span>
                                      </div>
                                    )}
                                    {isImplemented && (
                                      <div className="flex items-center text-green-600">
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        <span className="text-xs">Implemented</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8 text-center">
                            <p className="text-muted-foreground">No risk assessments available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Schedule Optimization</CardTitle>
                      <CardDescription>Critical path changes to reduce project timeline</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {scheduleOptimizations.length > 0 ? (
                          scheduleOptimizations.map((optimization: any, index: number) => {
                            const insightKey = `${optimization.id || index}-${optimization.task}`
                            const isImplemented = implementedInsights[insightKey]
                            const isImplementing = implementing === insightKey

                            return (
                              <div
                                key={optimization.id || index}
                                className={`flex items-start gap-4 rounded-md border p-4 cursor-pointer transition-colors ${
                                  activeInsight === optimization
                                    ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
                                    : isImplemented
                                      ? "border-green-500 bg-green-50/50 dark:bg-green-950/50"
                                      : "hover:bg-muted/50"
                                }`}
                                onClick={() => handleInsightClick(optimization)}
                              >
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    isImplemented
                                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                                      : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100"
                                  }`}
                                >
                                  {isImplemented ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <Lightbulb className="h-4 w-4" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">{optimization.task}</h4>
                                    <Badge className="bg-purple-500">{optimization.optimizedDuration}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Original duration: {optimization.originalDuration}
                                  </p>
                                  <div className="mt-2">
                                    <p className="text-sm font-medium">Optimization Strategy:</p>
                                    <p className="text-sm text-muted-foreground">{optimization.strategy}</p>
                                  </div>
                                  <div className="mt-2 flex items-center justify-between">
                                    {isImplementing && (
                                      <div className="flex items-center">
                                        <Clock className="mr-1 h-3 w-3 animate-pulse" />
                                        <span className="text-xs">Implementing...</span>
                                      </div>
                                    )}
                                    {isImplemented && (
                                      <div className="flex items-center text-green-600">
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        <span className="text-xs">Implemented</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8 text-center">
                            <p className="text-muted-foreground">No schedule optimizations available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="analyzer">
              <AIAnalyzer />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Insight Details</CardTitle>
              <CardDescription>Detailed analysis and implementation steps</CardDescription>
            </CardHeader>
            <CardContent>
              {activeInsight ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{activeInsight.title}</h3>
                    <Badge
                      className={
                        activeInsight.impact === "High"
                          ? "bg-green-500"
                          : activeInsight.impact === "Medium"
                            ? "bg-blue-500"
                            : activeInsight.severity === "Critical"
                              ? "bg-red-500"
                              : activeInsight.severity === "High"
                                ? "bg-amber-500"
                                : activeInsight.severity === "Medium"
                                  ? "bg-blue-500"
                                  : "bg-purple-500"
                      }
                    >
                      {activeInsight.impact || activeInsight.severity || "Optimization"}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-muted-foreground">{activeInsight.description}</p>
                  </div>

                  {(activeInsight.savingsEstimate || activeInsight.carbonReduction) && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {activeInsight.savingsEstimate && (
                        <div className="rounded-md border p-4">
                          <p className="text-sm font-medium">Estimated Savings</p>
                          <p className="text-2xl font-bold">{activeInsight.savingsEstimate}</p>
                        </div>
                      )}

                      {activeInsight.carbonReduction && (
                        <div className="rounded-md border p-4 bg-green-50 dark:bg-green-950">
                          <p className="text-sm font-medium text-green-700 dark:text-green-300">Carbon Reduction</p>
                          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                            {activeInsight.carbonReduction}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeInsight.mitigationStrategy && (
                    <div className="rounded-md border p-4 mt-4">
                      <p className="text-sm font-medium">Mitigation Strategy</p>
                      <p className="mt-1">{activeInsight.mitigationStrategy}</p>
                    </div>
                  )}

                  {activeInsight.strategy && (
                    <div className="rounded-md border p-4 mt-4">
                      <p className="text-sm font-medium">Implementation Strategy</p>
                      <p className="mt-1">{activeInsight.strategy}</p>
                    </div>
                  )}

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Implementation Steps</h4>
                    <div className="space-y-2">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-start gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 mt-0.5">
                            {step}
                          </div>
                          <div>
                            <p className="font-medium">
                              {step === 1
                                ? "Analyze current allocation"
                                : step === 2
                                  ? "Prepare transition plan"
                                  : "Implement and monitor"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {step === 1
                                ? "Review current resource distribution and identify areas for optimization."
                                : step === 2
                                  ? "Create a detailed plan for implementing the recommended changes."
                                  : "Execute the plan and continuously monitor results against projections."}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={() => handleImplementRecommendation(activeInsight)}
                      disabled={
                        implementedInsights[`${activeInsight.id}-${activeInsight.title}`] ||
                        implementing === `${activeInsight.id}-${activeInsight.title}`
                      }
                    >
                      {implementing === `${activeInsight.id}-${activeInsight.title}` ? (
                        <>
                          Implementing<span className="ml-2 animate-pulse">...</span>
                        </>
                      ) : implementedInsights[`${activeInsight.id}-${activeInsight.title}`] ? (
                        <>
                          Implemented <CheckCircle2 className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Implement Recommendation <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Select an insight</h3>
                  <p className="text-sm text-muted-foreground max-w-md mt-2">
                    Click on any AI-generated insight from the left panel to view detailed analysis and implementation
                    steps.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function AIInsightsSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      <Skeleton className="h-[120px] w-full mb-4" />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Skeleton className="h-10 w-full mb-4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Skeleton className="h-24 w-full rounded-md" />
                  <Skeleton className="h-24 w-full rounded-md" />
                </div>

                <Skeleton className="h-6 w-40 mt-4" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

