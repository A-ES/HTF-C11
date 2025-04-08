"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface DataUploadProps {
  onDataAnalyzed: (data: any) => void
}

export function DataUpload({ onDataAnalyzed }: DataUploadProps) {
  const { toast } = useToast()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"file" | "paste">("file")
  const [jsonData, setJsonData] = useState("")
  const [uploadError, setUploadError] = useState("")

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadError("")
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 100)

    try {
      // Read the file
      const text = await file.text()
      let data

      try {
        data = JSON.parse(text)
      } catch (e) {
        setUploadError("Invalid JSON format. Please upload a valid JSON file.")
        clearInterval(interval)
        setIsUploading(false)
        return
      }

      // Validate data
      if (!data || Object.keys(data).length === 0) {
        setUploadError("Empty data object. Please provide project data for analysis.")
        clearInterval(interval)
        setIsUploading(false)
        return
      }

      // Complete the upload
      clearInterval(interval)
      setUploadProgress(100)
      setIsUploading(false)

      // Start analysis
      await analyzeData(data)
    } catch (error) {
      clearInterval(interval)
      setUploadError("Error reading file. Please try again.")
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handlePastedData = async () => {
    if (!jsonData.trim()) {
      setUploadError("Please enter JSON data.")
      return
    }

    setUploadError("")
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 10
      })
    }, 100)

    try {
      let data

      try {
        data = JSON.parse(jsonData)
      } catch (e) {
        setUploadError("Invalid JSON format. Please enter valid JSON data.")
        clearInterval(interval)
        setIsUploading(false)
        return
      }

      // Validate data
      if (!data || Object.keys(data).length === 0) {
        setUploadError("Empty data object. Please provide project data for analysis.")
        clearInterval(interval)
        setIsUploading(false)
        return
      }

      // Complete the upload
      clearInterval(interval)
      setUploadProgress(100)
      setIsUploading(false)

      // Start analysis
      await analyzeData(data)
    } catch (error) {
      clearInterval(interval)
      setUploadError("Error processing data. Please try again.")
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const analyzeData = async (data: any) => {
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Analysis Complete",
          description: "AI has analyzed your project data and generated recommendations.",
        })

        // Pass the analyzed data to the parent component
        onDataAnalyzed(result.data)
      } else {
        throw new Error(result.error || "Analysis failed")
      }
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "There was an error analyzing your data. Please try again.",
        variant: "destructive",
      })
      setUploadError(error.message || "Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Sample data for demonstration
  const generateSampleData = async () => {
    const sampleData = {
      projectName: "Downtown Office Complex",
      projectType: "Commercial",
      startDate: "2024-01-15",
      endDate: "2024-08-30",
      budget: 1800000,
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: "123 Main St, San Francisco, CA",
      },
      materials: [
        { id: 1, name: "Concrete", quantity: 450, unit: "cubic yards", unitCost: 125, category: "Structural" },
        { id: 2, name: "Steel Beams", quantity: 85, unit: "tons", unitCost: 2200, category: "Structural" },
        { id: 3, name: "Lumber", quantity: 12000, unit: "board feet", unitCost: 3.5, category: "Framing" },
        { id: 4, name: "Electrical Wiring", quantity: 25000, unit: "feet", unitCost: 0.75, category: "Electrical" },
        { id: 5, name: "Plumbing Pipes", quantity: 8000, unit: "feet", unitCost: 2.25, category: "Plumbing" },
      ],
      labor: [
        { id: 1, role: "General Laborers", count: 30, hourlyRate: 25, hoursPerWeek: 40 },
        { id: 2, role: "Carpenters", count: 12, hourlyRate: 35, hoursPerWeek: 40 },
        { id: 3, role: "Electricians", count: 10, hourlyRate: 45, hoursPerWeek: 40 },
        { id: 4, role: "Plumbers", count: 7, hourlyRate: 42, hoursPerWeek: 40 },
        { id: 5, role: "Project Managers", count: 2, hourlyRate: 65, hoursPerWeek: 40 },
      ],
      equipment: [
        { id: 1, name: "Excavator", quantity: 3, dailyRate: 450, fuelConsumption: 12 },
        { id: 2, name: "Crane", quantity: 2, dailyRate: 850, fuelConsumption: 18 },
        { id: 3, name: "Bulldozer", quantity: 2, dailyRate: 550, fuelConsumption: 15 },
        { id: 4, name: "Concrete Mixer", quantity: 4, dailyRate: 250, fuelConsumption: 8 },
        { id: 5, name: "Generator", quantity: 6, dailyRate: 120, fuelConsumption: 5 },
      ],
      schedule: [
        { id: 1, phase: "Foundation", startDate: "2024-01-15", endDate: "2024-02-28", dependencies: [] },
        { id: 2, phase: "Structural Framework", startDate: "2024-03-01", endDate: "2024-04-15", dependencies: [1] },
        { id: 3, phase: "Electrical & Plumbing", startDate: "2024-04-16", endDate: "2024-05-30", dependencies: [2] },
        { id: 4, phase: "Interior Construction", startDate: "2024-06-01", endDate: "2024-07-15", dependencies: [3] },
        { id: 5, phase: "Finishing & Inspection", startDate: "2024-07-16", endDate: "2024-08-30", dependencies: [4] },
      ],
      risks: [
        {
          id: 1,
          category: "Weather",
          probability: 0.3,
          impact: "Medium",
          description: "Potential heavy rainfall in spring",
        },
        {
          id: 2,
          category: "Supply Chain",
          probability: 0.4,
          impact: "High",
          description: "Possible steel delivery delays",
        },
        {
          id: 3,
          category: "Labor",
          probability: 0.25,
          impact: "Medium",
          description: "Skilled labor shortage in the region",
        },
      ],
      sustainability: {
        targetCarbonFootprint: 220,
        renewableEnergyTarget: 50,
        wasteRecyclingTarget: 85,
        greenMaterialsPercentage: 40,
      },
    }

    setJsonData(JSON.stringify(sampleData, null, 2))
    setUploadMethod("paste")
  }

  // Alternative sample data with different values
  const generateAlternativeSampleData = async () => {
    const sampleData = {
      projectName: "Residential High-Rise",
      projectType: "Residential",
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      budget: 3500000,
      location: {
        latitude: 40.7128,
        longitude: -74.006,
        address: "456 Park Ave, New York, NY",
      },
      materials: [
        { id: 1, name: "Concrete", quantity: 850, unit: "cubic yards", unitCost: 135, category: "Structural" },
        { id: 2, name: "Steel Beams", quantity: 120, unit: "tons", unitCost: 2400, category: "Structural" },
        { id: 3, name: "Glass Panels", quantity: 450, unit: "panels", unitCost: 750, category: "Exterior" },
        { id: 4, name: "Electrical Wiring", quantity: 45000, unit: "feet", unitCost: 0.85, category: "Electrical" },
        { id: 5, name: "Plumbing Pipes", quantity: 12000, unit: "feet", unitCost: 2.5, category: "Plumbing" },
        { id: 6, name: "Insulation", quantity: 25000, unit: "sq feet", unitCost: 1.25, category: "Interior" },
      ],
      labor: [
        { id: 1, role: "General Laborers", count: 45, hourlyRate: 28, hoursPerWeek: 40 },
        { id: 2, role: "Carpenters", count: 18, hourlyRate: 38, hoursPerWeek: 40 },
        { id: 3, role: "Electricians", count: 15, hourlyRate: 48, hoursPerWeek: 40 },
        { id: 4, role: "Plumbers", count: 12, hourlyRate: 45, hoursPerWeek: 40 },
        { id: 5, role: "Project Managers", count: 4, hourlyRate: 70, hoursPerWeek: 40 },
        { id: 6, role: "Architects", count: 3, hourlyRate: 75, hoursPerWeek: 30 },
      ],
      equipment: [
        { id: 1, name: "Tower Crane", quantity: 2, dailyRate: 1200, fuelConsumption: 0 },
        { id: 2, name: "Concrete Pump", quantity: 3, dailyRate: 650, fuelConsumption: 14 },
        { id: 3, name: "Excavator", quantity: 4, dailyRate: 480, fuelConsumption: 13 },
        { id: 4, name: "Generator", quantity: 8, dailyRate: 150, fuelConsumption: 6 },
        { id: 5, name: "Elevator Lift", quantity: 4, dailyRate: 350, fuelConsumption: 0 },
      ],
      schedule: [
        { id: 1, phase: "Site Preparation", startDate: "2024-03-01", endDate: "2024-04-15", dependencies: [] },
        { id: 2, phase: "Foundation", startDate: "2024-04-16", endDate: "2024-06-30", dependencies: [1] },
        { id: 3, phase: "Structural Framework", startDate: "2024-07-01", endDate: "2024-10-15", dependencies: [2] },
        { id: 4, phase: "Exterior Cladding", startDate: "2024-10-16", endDate: "2024-12-31", dependencies: [3] },
        { id: 5, phase: "Interior Systems", startDate: "2025-01-01", endDate: "2025-01-31", dependencies: [4] },
        { id: 6, phase: "Finishing & Inspection", startDate: "2025-02-01", endDate: "2025-02-28", dependencies: [5] },
      ],
      risks: [
        { id: 1, category: "Weather", probability: 0.25, impact: "Medium", description: "Winter construction delays" },
        {
          id: 2,
          category: "Supply Chain",
          probability: 0.35,
          impact: "High",
          description: "Glass panel delivery delays",
        },
        {
          id: 3,
          category: "Labor",
          probability: 0.4,
          impact: "High",
          description: "Skilled labor shortage in urban area",
        },
        {
          id: 4,
          category: "Financial",
          probability: 0.2,
          impact: "High",
          description: "Potential cost overruns due to material price volatility",
        },
        { id: 5, category: "Regulatory", probability: 0.3, impact: "Medium", description: "Permit approval delays" },
      ],
      sustainability: {
        targetCarbonFootprint: 350,
        renewableEnergyTarget: 40,
        wasteRecyclingTarget: 75,
        greenMaterialsPercentage: 35,
      },
    }

    setJsonData(JSON.stringify(sampleData, null, 2))
    setUploadMethod("paste")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Project Data</CardTitle>
        <CardDescription>
          Upload your construction project data for AI analysis and optimization recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as "file" | "paste")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">Upload Project JSON File</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your project JSON file or click to browse
              </p>
              <input
                type="file"
                id="file-upload"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading || isAnalyzing}
              />
              <Button
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={isUploading || isAnalyzing}
              >
                <FileUp className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-4">
              <Textarea
                placeholder="Paste your JSON data here..."
                className="min-h-[200px] font-mono text-sm"
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                disabled={isUploading || isAnalyzing}
              />
              <div className="flex justify-end">
                <Button onClick={handlePastedData} disabled={isUploading || isAnalyzing || !jsonData.trim()}>
                  Analyze Data
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {uploadError && (
          <div className="mt-4 flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{uploadError}</p>
          </div>
        )}

        {(isUploading || isAnalyzing) && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{isUploading ? "Uploading..." : "AI Analyzing..."}</span>
              <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
            {isAnalyzing && (
              <p className="text-sm text-muted-foreground animate-pulse">
                AI is analyzing your project data and generating optimization recommendations...
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="space-x-2">
          <Button variant="outline" onClick={generateSampleData} disabled={isUploading || isAnalyzing}>
            Sample: Office Complex
          </Button>
          <Button variant="outline" onClick={generateAlternativeSampleData} disabled={isUploading || isAnalyzing}>
            Sample: High-Rise
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">Supported format: JSON</div>
      </CardFooter>
    </Card>
  )
}

