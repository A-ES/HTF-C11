"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Brain, Loader2 } from "lucide-react"
import { analyzeWithHuggingFace } from "@/services/huggingface-service"
import { useProjectData } from "@/context/project-data-context"

export function AIAnalyzer() {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("mistralai/Mistral-7B-Instruct-v0.2")
  const [response, setResponse] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()
  const { analysisData } = useProjectData()

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a question or analysis request.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setResponse("")

    try {
      // Create a context-rich prompt with project data
      const contextPrompt = createContextPrompt(prompt, analysisData)

      // Call Hugging Face model
      const result = await analyzeWithHuggingFace(contextPrompt, model)

      setResponse(result.generated_text)

      toast({
        title: "Analysis complete",
        description: `Analysis completed using ${model.split("/").pop()}`,
      })
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRAGQuery = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a question for the RAG model.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setResponse("")

    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: prompt }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to process RAG query');
      }

      setResponse(data.response.generated_text);

      toast({
        title: "RAG Query Complete",
        description: "Response generated using RAG model",
      });
    } catch (error) {
      console.error("RAG Query Error:", error);
      toast({
        title: "RAG Query Failed",
        description: "There was an error processing your RAG query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  // Helper function to create a context-rich prompt
  const createContextPrompt = (userPrompt: string, data: any) => {
    if (!data) return userPrompt

    // Extract key metrics to provide context
    const projectMetrics = data.projectMetrics || {}
    const budget = projectMetrics.totalBudget || 0
    const materialCost = projectMetrics.totalMaterialCost || 0
    const laborCost = projectMetrics.totalLaborCost || 0
    const equipmentCost = projectMetrics.totalEquipmentCost || 0
    const completion = projectMetrics.completionPercentage || 0
    const riskLevel = projectMetrics.riskLevel || "Medium"

    // Create a context-rich prompt
    return `You are an AI assistant specialized in construction project analysis. 
    
Project context:
- Budget: $${budget.toLocaleString()}
- Current spend: $${(materialCost + laborCost + equipmentCost).toLocaleString()}
- Completion: ${completion}%
- Risk level: ${riskLevel}

User question: ${userPrompt}

Provide a detailed analysis based on this construction project data.`
  }

  // Predefined prompt suggestions
  const promptSuggestions = [
    "Analyze the main risks in this construction project and suggest mitigation strategies.",
    "What are the potential budget optimization opportunities for this project?",
    "How can we improve the project timeline and identify critical path optimizations?",
    "Analyze the environmental impact of this project and suggest sustainability improvements.",
    "What resource allocation improvements would you recommend for this project?",
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5 text-blue-500" />
          AI Project Analyzer
        </CardTitle>
        <CardDescription>Use advanced language models to analyze your construction project data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Model</label>
            <span className="text-xs text-muted-foreground">Powered by Hugging Face</span>
          </div>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mistralai/Mistral-7B-Instruct-v0.2">Mistral 7B</SelectItem>
              <SelectItem value="meta-llama/Llama-2-13b-chat-hf">Llama 2 13B</SelectItem>
              <SelectItem value="google/gemma-7b">Gemma 7B</SelectItem>
              <SelectItem value="microsoft/phi-2">Phi-2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt</label>
          <Textarea
            placeholder="Ask a question or request an analysis of your project data..."
            className="min-h-[100px]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt suggestions</label>
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((suggestion, index) => (
              <Button key={index} variant="outline" size="sm" onClick={() => setPrompt(suggestion)} className="text-xs">
                {suggestion.length > 40 ? suggestion.substring(0, 40) + "..." : suggestion}
              </Button>
            ))}
          </div>
        </div>

        {response && (
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Analysis Result</label>
            <div className="rounded-md border bg-muted/50 p-4 text-sm whitespace-pre-line">{response}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setPrompt("")} disabled={isAnalyzing}>
          Clear
        </Button>
        <Button onClick={handleAnalyze} disabled={isAnalyzing || !prompt.trim()}>
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>Analyze with AI</>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

