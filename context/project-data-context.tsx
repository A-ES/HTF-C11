"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ProjectDataContextType {
  analysisData: any | null
  setAnalysisData: (data: any) => void
  isDataLoaded: boolean
  clearData: () => void
}

const ProjectDataContext = createContext<ProjectDataContextType | undefined>(undefined)

export function ProjectDataProvider({ children }: { children: ReactNode }) {
  const [analysisData, setAnalysisData] = useState<any | null>(null)

  const handleSetAnalysisData = (data: any) => {
    setAnalysisData(data)
  }

  const clearData = () => {
    setAnalysisData(null)
  }

  return (
    <ProjectDataContext.Provider
      value={{
        analysisData,
        setAnalysisData: handleSetAnalysisData,
        isDataLoaded: !!analysisData,
        clearData,
      }}
    >
      {children}
    </ProjectDataContext.Provider>
  )
}

export function useProjectData() {
  const context = useContext(ProjectDataContext)
  if (context === undefined) {
    throw new Error("useProjectData must be used within a ProjectDataProvider")
  }
  return context
}

