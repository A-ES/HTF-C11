"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Download, Leaf, RefreshCw, Truck, Droplet, Trash2, Sun } from "lucide-react"
import { ResourceChart } from "@/components/resource-chart"
import { useProjectData } from "@/context/project-data-context"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function EnvironmentalImpact() {
  const { analysisData } = useProjectData()
  const { toast } = useToast()
  const [isRecalculating, setIsRecalculating] = useState(false)

  // Extract environmental data
  const environmentalData = analysisData?.environmentalImpact || {}
  const footprint = environmentalData.currentFootprint || {}
  const targets = environmentalData.targets || {}
  const recommendations = environmentalData.recommendations || []
  const materialImpact = environmentalData.materialImpact || []
  const equipmentImpact = environmentalData.equipmentImpact || []

  // Calculate industry averages and comparisons
  const carbonComparison = footprint.carbon ? Math.round((targets.carbon / footprint.carbon - 1) * 100) : -15

  const waterComparison = footprint.water ? Math.round((targets.water / footprint.water - 1) * 100) : -22

  // Generate carbon breakdown data
  const carbonBreakdown = generateCarbonBreakdown(materialImpact, equipmentImpact)

  // Generate environmental impact trend
  const impactTrend = generateImpactTrend(analysisData)

  // Handle recalculate
  const handleRecalculate = () => {
    setIsRecalculating(true)

    // Simulate recalculation process
    setTimeout(() => {
      setIsRecalculating(false)
      toast({
        title: "Environmental Impact Recalculated",
        description: "Updated calculations based on the latest project data.",
      })
    }, 2000)
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Environmental Impact</h2>
          <p className="text-muted-foreground">Carbon footprint and sustainability metrics</p>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{footprint.carbon || 245} tons CO₂e</div>
            <div className="flex items-center mt-2">
              <Badge
                className={
                  carbonComparison < -20 ? "bg-red-500" : carbonComparison < -10 ? "bg-amber-500" : "bg-green-500"
                }
              >
                {carbonComparison < -20 ? "High Impact" : carbonComparison < -10 ? "Moderate Impact" : "Low Impact"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.abs(carbonComparison)}% {carbonComparison < 0 ? "above" : "below"} industry average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
            <Droplet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(footprint.water || 1200000).toLocaleString()} gallons</div>
            <div className="flex items-center mt-2">
              <Badge
                className={
                  waterComparison < -20 ? "bg-red-500" : waterComparison < -10 ? "bg-amber-500" : "bg-green-500"
                }
              >
                {waterComparison < -20 ? "High Usage" : waterComparison < -10 ? "Moderate Usage" : "Efficient"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.abs(waterComparison)}% {waterComparison < 0 ? "above" : "below"} similar projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Recycling</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{footprint.waste || 78}%</div>
            <Progress value={footprint.waste || 78} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Target: {targets.waste || 85}% recycling rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewable Energy</CardTitle>
            <Sun className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{footprint.renewable || 35}%</div>
            <Progress value={footprint.renewable || 35} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Target: {targets.renewable || 50}% renewable usage</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Carbon Footprint Breakdown</CardTitle>
            <CardDescription>Sources of carbon emissions in the project</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResourceChart type="pie" resourceType="materials" data={carbonBreakdown} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environmental Impact Trend</CardTitle>
            <CardDescription>Monthly carbon emissions throughout project lifecycle</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResourceChart type="line" resourceType="equipment" data={impactTrend} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sustainability Recommendations</CardTitle>
          <CardDescription>AI-generated suggestions to reduce environmental impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((recommendation: any, index: number) => (
              <div key={recommendation.id || index} className="flex items-start gap-4 rounded-md border p-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    index === 0
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                      : index === 1
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100"
                  }`}
                >
                  {index === 0 ? (
                    <Truck className="h-4 w-4" />
                  ) : index === 1 ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{recommendation.title}</h4>
                    <Badge className={recommendation.impact === "High" ? "bg-green-500" : "bg-blue-500"}>
                      {recommendation.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {index === 0 ? "Transportation" : index === 1 ? "Energy" : "Waste"}
                      </Badge>
                      <Badge variant="outline">{recommendation.carbonReduction || "-8 tons CO₂e"}</Badge>
                    </div>
                    <Button size="sm">
                      Implement
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {recommendations.length === 0 && (
              <div className="flex items-start gap-4 rounded-md border p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100">
                  <Truck className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Optimize Material Delivery Routes</h4>
                    <Badge className="bg-green-500">High Impact</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Consolidate deliveries and optimize routes to reduce transportation emissions by up to 18%.
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Transportation</Badge>
                      <Badge variant="outline">-12 tons CO₂e</Badge>
                    </div>
                    <Button size="sm">
                      Implement
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="materials" className="space-y-4">
        <TabsList>
          <TabsTrigger value="materials">Sustainable Materials</TabsTrigger>
          <TabsTrigger value="energy">Energy Efficiency</TabsTrigger>
          <TabsTrigger value="water">Water Conservation</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sustainable Material Usage</CardTitle>
              <CardDescription>Eco-friendly and recycled materials in the project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Recycled Content</span>
                    <span className="text-sm font-medium">
                      {analysisData?.projectData?.sustainability?.greenMaterialsPercentage || 42}%
                    </span>
                  </div>
                  <Progress value={analysisData?.projectData?.sustainability?.greenMaterialsPercentage || 42} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Low-Carbon Materials</span>
                    <span className="text-sm font-medium">
                      {Math.round((analysisData?.projectData?.sustainability?.greenMaterialsPercentage || 42) * 0.85)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.round(
                      (analysisData?.projectData?.sustainability?.greenMaterialsPercentage || 42) * 0.85,
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Locally Sourced</span>
                    <span className="text-sm font-medium">
                      {Math.round((analysisData?.projectData?.sustainability?.greenMaterialsPercentage || 42) * 1.6)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      Math.round((analysisData?.projectData?.sustainability?.greenMaterialsPercentage || 42) * 1.6),
                    )}
                  />
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-semibold mb-2">Top Sustainable Materials Used</h4>
                  <ul className="space-y-2">
                    {generateSustainableMaterials(analysisData).map((material, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span className="text-sm">{material.name}</span>
                        <Badge>{material.badge}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="energy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Efficiency Measures</CardTitle>
              <CardDescription>Strategies to reduce energy consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h4 className="font-semibold mb-2">Energy Sources</h4>
                  <ResourceChart
                    type="pie"
                    resourceType="equipment"
                    data={[
                      { name: "Grid Electricity", value: 100 - (footprint.renewable || 35) },
                      { name: "Solar Power", value: Math.round((footprint.renewable || 35) * 0.7) },
                      { name: "Biodiesel", value: Math.round((footprint.renewable || 35) * 0.2) },
                      { name: "Battery Storage", value: Math.round((footprint.renewable || 35) * 0.1) },
                    ]}
                  />
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-semibold mb-2">Energy Efficiency Initiatives</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between">
                      <span className="text-sm">LED Site Lighting</span>
                      <Badge className="bg-green-500">Implemented</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Equipment Power Management</span>
                      <Badge className="bg-green-500">Implemented</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Solar-Powered Site Office</span>
                      <Badge className="bg-amber-500">In Progress</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Electric Equipment Transition</span>
                      <Badge className="bg-gray-500">Planned</Badge>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Water Conservation</CardTitle>
              <CardDescription>Measures to reduce water usage and promote conservation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Water Usage Trend</h4>
                  <ResourceChart type="line" resourceType="labor" data={generateWaterUsageTrend(analysisData)} />
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-semibold mb-2">Water Conservation Measures</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Rainwater Harvesting</span>
                      <Badge className="bg-green-500">Implemented</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Water Recycling System</span>
                      <Badge className="bg-green-500">Implemented</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Low-Flow Fixtures</span>
                      <Badge className="bg-amber-500">In Progress</Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Drought-Resistant Landscaping</span>
                      <Badge className="bg-gray-500">Planned</Badge>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper function to generate carbon breakdown
function generateCarbonBreakdown(materialImpact: any[], equipmentImpact: any[]) {
  if (!materialImpact || !equipmentImpact || (materialImpact.length === 0 && equipmentImpact.length === 0)) {
    return [
      { name: "Materials", value: 45 },
      { name: "Transportation", value: 25 },
      { name: "Equipment", value: 20 },
      { name: "Energy Use", value: 8 },
      { name: "Other", value: 2 },
    ]
  }

  // Calculate total carbon from materials
  const materialCarbon = materialImpact.reduce((sum, item) => sum + (item.carbonFootprint || 0), 0)

  // Calculate total carbon from equipment
  const equipmentCarbon = equipmentImpact.reduce((sum, item) => sum + (item.carbonFootprint || 0), 0)

  // Estimate transportation and energy use
  const transportationCarbon = materialCarbon * 0.3 // 30% of material carbon for transportation
  const energyCarbon = equipmentCarbon * 0.2 // 20% of equipment carbon for energy
  const otherCarbon = (materialCarbon + equipmentCarbon + transportationCarbon + energyCarbon) * 0.05 // 5% for other

  // Calculate total carbon
  const totalCarbon = materialCarbon + equipmentCarbon + transportationCarbon + energyCarbon + otherCarbon

  // Convert to percentages
  return [
    { name: "Materials", value: Math.round((materialCarbon / totalCarbon) * 100) },
    { name: "Transportation", value: Math.round((transportationCarbon / totalCarbon) * 100) },
    { name: "Equipment", value: Math.round((equipmentCarbon / totalCarbon) * 100) },
    { name: "Energy Use", value: Math.round((energyCarbon / totalCarbon) * 100) },
    { name: "Other", value: Math.round((otherCarbon / totalCarbon) * 100) },
  ]
}

// Helper function to generate impact trend
function generateImpactTrend(analysisData: any) {
  if (!analysisData || !analysisData.projectData) {
    return Array.from({ length: 8 }, (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][i],
      value: 28 + (i < 4 ? i * 7 : (7 - i) * 7),
    }))
  }

  const schedule = analysisData.projectData.schedule || []
  const footprint = analysisData.environmentalImpact?.footprint || {}

  // If we have schedule data, use it to model environmental impact
  if (schedule.length > 0) {
    // Calculate project duration in months
    const startDates = schedule.map((phase) => new Date(phase.startDate).getTime())
    const endDates = schedule.map((phase) => new Date(phase.endDate).getTime())
    const projectStart = new Date(Math.min(...startDates))
    const projectEnd = new Date(Math.max(...endDates))

    // Generate monthly data points
    const months = []
    const currentDate = new Date(projectStart)
    while (currentDate <= projectEnd) {
      months.push(new Date(currentDate))
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    // Ensure we have at least 8 months
    while (months.length < 8) {
      const lastDate = new Date(months[months.length - 1])
      lastDate.setMonth(lastDate.getMonth() + 1)
      months.push(lastDate)
    }

    // Limit to 8 months
    const selectedMonths = months.slice(0, 8)

    // Calculate carbon impact for each month
    return selectedMonths.map((date, i) => {
      const monthName = date.toLocaleString("default", { month: "short" })

      // Model a bell curve for carbon emissions
      const totalMonths = selectedMonths.length
      const monthIndex = i
      const normalizedPosition = monthIndex / (totalMonths - 1)

      // Bell curve formula: e^(-(x-0.5)^2 / 0.05)
      const bellCurveValue = Math.exp(-Math.pow(normalizedPosition - 0.5, 2) / 0.05)

      // Scale to carbon footprint
      const baseValue = footprint.carbon ? footprint.carbon / 8 : 30
      const value = Math.round(baseValue * bellCurveValue)

      return {
        name: monthName,
        value,
      }
    })
  }

  // Fallback to realistic curve data
  return Array.from({ length: 8 }, (_, i) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]

    // Create a bell curve
    let value
    if (i < 4) {
      value = 28 + i * 7
    } else {
      value = 28 + (7 - i) * 7
    }

    // Scale to carbon footprint
    const scaleFactor = footprint.carbon ? footprint.carbon / 240 : 1

    return {
      name: monthNames[i],
      value: Math.round(value * scaleFactor),
    }
  })
}

// Helper function to generate sustainable materials
function generateSustainableMaterials(analysisData: any) {
  if (!analysisData || !analysisData.projectData || !analysisData.projectData.materials) {
    return [
      { name: "Recycled Steel", badge: "65% recycled content" },
      { name: "Low-Carbon Concrete", badge: "30% less emissions" },
      { name: "Sustainable Timber", badge: "FSC Certified" },
      { name: "Reclaimed Brick", badge: "100% reused" },
    ]
  }

  const materials = analysisData.projectData.materials
  const sustainableMaterials = []

  // Look for concrete
  const concrete = materials.find((m) => (m.name || "").toLowerCase().includes("concrete"))
  if (concrete) {
    sustainableMaterials.push({ name: "Low-Carbon Concrete", badge: "30% less emissions" })
  }

  // Look for steel
  const steel = materials.find((m) => (m.name || "").toLowerCase().includes("steel"))
  if (steel) {
    sustainableMaterials.push({ name: "Recycled Steel", badge: "65% recycled content" })
  }

  // Look for wood/lumber
  const wood = materials.find((m) => {
    const name = (m.name || "").toLowerCase()
    return name.includes("wood") || name.includes("lumber") || name.includes("timber")
  })
  if (wood) {
    sustainableMaterials.push({ name: "Sustainable Timber", badge: "FSC Certified" })
  }

  // Look for brick
  const brick = materials.find((m) => (m.name || "").toLowerCase().includes("brick"))
  if (brick) {
    sustainableMaterials.push({ name: "Reclaimed Brick", badge: "100% reused" })
  }

  // Add insulation if present
  const insulation = materials.find((m) => (m.name || "").toLowerCase().includes("insulation"))
  if (insulation) {
    sustainableMaterials.push({ name: "Eco-Friendly Insulation", badge: "85% recycled content" })
  }

  // If we don't have enough materials, add generic ones
  while (sustainableMaterials.length < 4) {
    const options = [
      { name: "Recycled Aggregate", badge: "40% recycled content" },
      { name: "Low-VOC Paint", badge: "Zero emissions" },
      { name: "Bamboo Flooring", badge: "Rapidly renewable" },
      { name: "Reclaimed Glass", badge: "90% recycled content" },
    ]

    const option = options.find((o) => !sustainableMaterials.some((m) => m.name === o.name))
    if (option) {
      sustainableMaterials.push(option)
    } else {
      break
    }
  }

  return sustainableMaterials
}

// Helper function to generate water usage trend
function generateWaterUsageTrend(analysisData: any) {
  if (!analysisData || !analysisData.projectData) {
    return Array.from({ length: 6 }, (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
      value: 180000 + (i < 3 ? i * 30000 : (5 - i) * 30000),
    }))
  }

  const schedule = analysisData.projectData.schedule || []
  const footprint = analysisData.environmentalImpact?.footprint || {}

  // If we have schedule data, use it to model water usage
  if (schedule.length > 0) {
    // Calculate project duration in months
    const startDates = schedule.map((phase) => new Date(phase.startDate).getTime())
    const endDates = schedule.map((phase) => new Date(phase.endDate).getTime())
    const projectStart = new Date(Math.min(...startDates))
    const projectEnd = new Date(Math.max(...endDates))

    // Generate monthly data points
    const months = []
    const currentDate = new Date(projectStart)
    while (currentDate <= projectEnd) {
      months.push(new Date(currentDate))
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    // Ensure we have at least 6 months
    while (months.length < 6) {
      const lastDate = new Date(months[months.length - 1])
      lastDate.setMonth(lastDate.getMonth() + 1)
      months.push(lastDate)
    }

    // Limit to 6 months
    const selectedMonths = months.slice(0, 6)

    // Calculate water usage for each month
    return selectedMonths.map((date, i) => {
      const monthName = date.toLocaleString("default", { month: "short" })

      // Model a bell curve for water usage
      const totalMonths = selectedMonths.length
      const monthIndex = i
      const normalizedPosition = monthIndex / (totalMonths - 1)

      // Bell curve formula: e^(-(x-0.5)^2 / 0.05)
      const bellCurveValue = Math.exp(-Math.pow(normalizedPosition - 0.5, 2) / 0.05)

      // Scale to water usage
      const baseValue = footprint.water ? footprint.water / 6 : 200000
      const value = Math.round(baseValue * bellCurveValue)

      return {
        name: monthName,
        value,
      }
    })
  }

  // Fallback to realistic curve data
  return Array.from({ length: 6 }, (_, i) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

    // Create a bell curve
    let value
    if (i < 3) {
      value = 180000 + i * 30000
    } else {
      value = 180000 + (5 - i) * 30000
    }

    // Scale to water usage
    const scaleFactor = footprint.water ? footprint.water / 1200000 : 1

    return {
      name: monthNames[i],
      value: Math.round(value * scaleFactor),
    }
  })
}

