import { NextResponse } from "next/server"
import { analyzeWithHuggingFace } from "@/services/huggingface-service"

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    
    if (!query) {
      return NextResponse.json(
        { success: false, error: "No query provided" }, 
        { status: 400 }
      )
    }

    // Construct context prompt for RAG
    const contextPrompt = `You are an AI assistant specialized in construction project analysis. 
    Answer the following question based on your knowledge and the provided project data:
    
    Question: ${query}
    
    Provide a detailed response with actionable recommendations.`

    // Get response from Hugging Face model
    const response = await analyzeWithHuggingFace(contextPrompt, "mistralai/Mistral-7B-Instruct-v0.2")
    
    return NextResponse.json({
      success: true,
      response
    })
    
  } catch (error: any) {
    console.error("Error processing RAG query:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process query" },
      { status: 500 }
    )
  }
}