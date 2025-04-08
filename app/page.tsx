"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContent } from "@/components/dashboard-content"
import { DataUpload } from "@/components/data-upload"
import { useProjectData } from "@/context/project-data-context"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function Home() {
  const { analysisData, setAnalysisData, isDataLoaded, clearData } = useProjectData()
  const [isUploading, setIsUploading] = useState(!isDataLoaded)

  const handleDataAnalyzed = (data: any) => {
    setAnalysisData(data)
    setIsUploading(false)
  }

  const handleNewUpload = () => {
    clearData()
    setIsUploading(true)
  }

  return (
    <DashboardLayout>
      {isUploading ? (
        <div className="container mx-auto py-6">
          <DataUpload onDataAnalyzed={handleDataAnalyzed} />
        </div>
      ) : (
        <>
          <div className="flex justify-end px-6 pt-4">
            <Button variant="outline" size="sm" onClick={handleNewUpload}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Upload New Data
            </Button>
          </div>
          <DashboardContent />
        </>
      )}
    </DashboardLayout>
  )
}

