"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, ThumbsUp } from "lucide-react"

interface ImplementationTrackerProps {
  implementedInsights: Record<string, boolean>
  allInsights: any[]
}

export function ImplementationTracker({ implementedInsights, allInsights }: ImplementationTrackerProps) {
  const [implementationPercentage, setImplementationPercentage] = useState(0)
  const [estimatedSavings, setEstimatedSavings] = useState(0)
  const [carbonReduction, setCarbonReduction] = useState(0)

  useEffect(() => {
    if (allInsights.length === 0) return

    // Calculate implementation percentage
    const implementedCount = Object.keys(implementedInsights).filter((key) => implementedInsights[key]).length
    const percentage = Math.round((implementedCount / allInsights.length) * 100)
    setImplementationPercentage(percentage)

    // Calculate estimated savings
    let totalSavings = 0
    let totalCarbon = 0

    allInsights.forEach((insight) => {
      const key = `${insight.id}-${insight.title}`
      if (implementedInsights[key]) {
        // Extract savings amount
        if (insight.savingsEstimate) {
          const match = insight.savingsEstimate.match(/\$([,\d]+)/)
          if (match && match[1]) {
            totalSavings += Number.parseInt(match[1].replace(/,/g, ""), 10)
          }
        }

        // Extract carbon reduction
        if (insight.carbonReduction) {
          const match = insight.carbonReduction.match(/(\d+\.?\d*)/)
          if (match && match[1]) {
            totalCarbon += Number.parseFloat(match[1])
          }
        }
      }
    })

    setEstimatedSavings(totalSavings)
    setCarbonReduction(totalCarbon)
  }, [implementedInsights, allInsights])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Implementation Progress</CardTitle>
        <CardDescription>Track the status of applied recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{implementationPercentage}%</span>
            </div>
            <Progress value={implementationPercentage} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="rounded-md border p-4">
              <div className="flex items-center gap-2 mb-1">
                <ThumbsUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Estimated Savings</span>
              </div>
              <p className="text-xl font-bold">${estimatedSavings.toLocaleString()}</p>
            </div>

            <div className="rounded-md border p-4 bg-green-50 dark:bg-green-950">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Carbon Reduction</span>
              </div>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">
                {carbonReduction.toFixed(1)} tons CO₂e
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>
                  {Object.keys(implementedInsights).filter((key) => implementedInsights[key]).length} Implemented
                </span>
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-amber-500" />
                <span>
                  {allInsights.length -
                    Object.keys(implementedInsights).filter((key) => implementedInsights[key]).length}{" "}
                  Pending
                </span>
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

