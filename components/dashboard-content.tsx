"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectOverview } from "@/components/project-overview"
import { ResourceAllocation } from "@/components/resource-allocation"
import { PredictiveAnalytics } from "@/components/predictive-analytics"
import { OptimizationRecommendations } from "@/components/optimization-recommendations"
import { EnvironmentalImpact } from "@/components/environmental-impact"
import { useProjectData } from "@/context/project-data-context"
import { AIInsights } from "@/components/ai-insights"

export function DashboardContent() {
  const { analysisData } = useProjectData()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Smart Resource Optimization for Efficient Construction Management</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger
            value="ai-insights"
            className="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
          >
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <ProjectOverview />
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <ResourceAllocation />
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <PredictiveAnalytics />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <OptimizationRecommendations />
        </TabsContent>

        <TabsContent value="environmental" className="space-y-4">
          <EnvironmentalImpact />
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <AIInsights />
        </TabsContent>
      </Tabs>
    </div>
  )
}

