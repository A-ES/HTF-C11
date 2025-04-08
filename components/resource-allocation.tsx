"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResourceChart } from "@/components/resource-chart"
import { ResourceTable } from "@/components/resource-table"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"
import { useProjectData } from "@/context/project-data-context"

export function ResourceAllocation() {
  const { analysisData } = useProjectData()

  // Extract resource data from analysis
  const materialData = analysisData?.resourceOptimization?.materials || {}
  const laborData = analysisData?.resourceOptimization?.labor || {}
  const equipmentData = analysisData?.resourceOptimization?.equipment || {}

  // Get distribution data for charts
  const materialDistribution = materialData.distribution || [
    { name: "Foundation", value: 35 },
    { name: "Structure", value: 25 },
    { name: "Electrical", value: 15 },
    { name: "Plumbing", value: 10 },
    { name: "Interior", value: 15 },
  ]

  const laborDistribution = laborData.distribution || [
    { name: "General Labor", value: 40 },
    { name: "Skilled Trades", value: 30 },
    { name: "Engineering", value: 15 },
    { name: "Management", value: 10 },
    { name: "Inspection", value: 5 },
  ]

  const equipmentDistribution = equipmentData.utilization || [
    { name: "Heavy Machinery", value: 35 },
    { name: "Power Tools", value: 25 },
    { name: "Vehicles", value: 20 },
    { name: "Scaffolding", value: 15 },
    { name: "Misc Equipment", value: 5 },
  ]

  // Generate trend data if not available
  const generateTrendData = (resourceType: string) => {
    const baseValue = resourceType === "materials" ? 40 : resourceType === "labor" ? 450 : 120
    return Array.from({ length: 6 }, (_, i) => ({
      name: `Week ${i + 1}`,
      value: baseValue + Math.floor(Math.random() * 40) + i * 10,
    }))
  }

  // Generate comparison data if not available
  const generateComparisonData = (resourceType: string) => {
    if (resourceType === "materials") {
      const materials = materialData.currentAllocation || []
      return materials.slice(0, 5).map((material: any) => ({
        name: material.name || `Material ${material.id}`,
        budget: material.quantity * (material.unitCost || 100),
        actual: material.quantity * (material.unitCost || 100) * (Math.random() * 0.3 + 0.85),
      }))
    } else if (resourceType === "labor") {
      const labor = laborData.currentAllocation || []
      return labor.slice(0, 5).map((role: any) => ({
        name: role.role || `Role ${role.id}`,
        target: 90 - Math.floor(Math.random() * 15),
        actual: 90 - Math.floor(Math.random() * 20),
      }))
    } else {
      const equipment = equipmentData.currentAllocation || []
      return equipment.slice(0, 5).map((item: any) => ({
        name: item.name || `Equipment ${item.id}`,
        rental: (item.dailyRate || 1000) * 15,
        owned: (item.dailyRate || 1000) * 15 * (Math.random() * 0.3 + 0.7),
      }))
    }
  }

  // Get or generate data for charts
  const materialTrendData = generateTrendData("materials")
  const laborTrendData = generateTrendData("labor")
  const equipmentTrendData = generateTrendData("equipment")

  const materialComparisonData = generateComparisonData("materials")
  const laborComparisonData = generateComparisonData("labor")
  const equipmentComparisonData = generateComparisonData("equipment")

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resource Allocation</h2>
          <p className="text-muted-foreground">Current allocation and utilization of project resources</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="materials" className="space-y-4">
        <TabsList>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="labor">Labor</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Material Allocation</CardTitle>
                <CardDescription>Distribution across project phases</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResourceChart type="pie" resourceType="materials" data={materialDistribution} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Material Usage Trend</CardTitle>
                <CardDescription>Weekly consumption rate</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResourceChart type="line" resourceType="materials" data={materialTrendData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Material Cost Analysis</CardTitle>
                <CardDescription>Budget vs. actual spending</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResourceChart type="bar" resourceType="materials" data={materialComparisonData} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Material Inventory</CardTitle>
              <CardDescription>Current stock levels and upcoming requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <ResourceTable resourceType="materials" data={materialData.currentAllocation} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labor" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Labor Distribution</CardTitle>
                <CardDescription>By skill category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResourceChart type="pie" resourceType="labor" data={laborDistribution} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Labor Hours Trend</CardTitle>
                <CardDescription>Weekly hours logged</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResourceChart type="line" resourceType="labor" data={laborTrendData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Labor Efficiency</CardTitle>
                <CardDescription>Productivity metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResourceChart type="bar" resourceType="labor" data={laborComparisonData} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Labor Allocation</CardTitle>
              <CardDescription>Current team assignments and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <ResourceTable resourceType="labor" data={laborData.currentAllocation} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Equipment Utilization</CardTitle>
                <CardDescription>Usage rates by equipment type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResourceChart type="pie" resourceType="equipment" data={equipmentDistribution} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Equipment Runtime</CardTitle>
                <CardDescription>Weekly operational hours</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResourceChart type="line" resourceType="equipment" data={equipmentTrendData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Equipment Cost Analysis</CardTitle>
                <CardDescription>Rental vs. ownership costs</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResourceChart type="bar" resourceType="equipment" data={equipmentComparisonData} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Equipment Inventory</CardTitle>
              <CardDescription>Current availability and maintenance status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResourceTable resourceType="equipment" data={equipmentData.currentAllocation} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

