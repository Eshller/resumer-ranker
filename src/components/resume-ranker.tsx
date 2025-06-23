"use client"

import { useState, useEffect, useCallback } from "react"
import * as pdfjs from "pdfjs-dist"

import { FileUploader } from "@/components/file-uploader"
import { ResultsTable } from "@/components/results-table"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, Loader2 } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { type ResumeResult } from "@/types"
import { extractEmail, extractName } from "@/lib/utils"
import { computeMatchScore } from "@/ai/flows/compute-match-score"

export default function ResumeRanker() {
  const [files, setFiles] = useState<File[]>([])
  const [jobDescription, setJobDescription] = useState("")
  const [results, setResults] = useState<ResumeResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isPdfWorkerReady, setIsPdfWorkerReady] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`
      setIsPdfWorkerReady(true)
    } catch (error) {
      console.error("Failed to set up PDF worker:", error)
      toast({
        title: "Error",
        description: "Could not initialize PDF viewer. Please refresh the page.",
        variant: "destructive",
      })
    }
  }, [toast])

  const extractTextFromPDF = useCallback(async (file: File): Promise<string> => {
    if (!isPdfWorkerReady) {
      throw new Error("PDF worker is not ready.")
    }
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument(arrayBuffer).promise
    let text = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((item) => ('str' in item ? item.str : '')).join(" ") + "\n";
    }
    return text
  }, [isPdfWorkerReady])


  const handleScreening = async () => {
    if (files.length === 0 || !jobDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please upload resumes and provide a job description.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setProgress(0)
    setResults([])
    
    const newResults: ResumeResult[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const resumeText = await extractTextFromPDF(file)
        const result = await computeMatchScore({
          resumeText,
          jobDescription,
        })

        if (result) {
          const fileUrl = URL.createObjectURL(file);
          newResults.push({
            id: file.name + Date.now(),
            fileName: file.name,
            fileUrl,
            candidateName: extractName(resumeText),
            email: extractEmail(resumeText),
            matchScore: result.matchScore,
            topMatchedSkills: result.topMatchedSkills,
            resumeText,
          })
        }
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error)
        toast({
          title: `Processing Error`,
          description: `Could not process ${file.name}.`,
          variant: "destructive",
        })
      } finally {
        setProgress(((i + 1) / files.length) * 100)
      }
    }
    
    setResults(newResults)
    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-5xl space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label htmlFor="resume-uploader" className="text-lg font-headline font-semibold">1. Upload Resumes</Label>
              <FileUploader onFilesChange={setFiles} disabled={isLoading} />
            </div>
            <div className="space-y-4">
              <Label htmlFor="job-description" className="text-lg font-headline font-semibold">2. Paste Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the full job description here..."
                className="min-h-[250px] text-sm"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="mt-6">
            <Button
              size="lg"
              className="w-full font-bold text-lg"
              onClick={handleScreening}
              disabled={isLoading || files.length === 0 || !jobDescription.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Screening...
                </>
              ) : (
                "Start Screening"
              )}
            </Button>
          </div>
          {isLoading && (
            <div className="mt-4 space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">Processing {files.length} resume(s)...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoading && results.length === 0 && (
         <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle className="font-headline">How it works</AlertTitle>
            <AlertDescription>
            This tool uses AI to analyze resumes against your job description. It extracts skills, calculates a semantic match score, and highlights top keywords to help you quickly identify the most promising candidates. All processing is done in your browser for privacy.
            </AlertDescription>
        </Alert>
      )}

      {!isLoading && <ResultsTable results={results} />}
    </div>
  )
}
