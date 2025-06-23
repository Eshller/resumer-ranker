"use client"

import { useState, useCallback } from "react"
import { UploadCloud, File, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void
  disabled?: boolean
}

export function FileUploader({ onFilesChange, disabled }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  const handleFileChange = useCallback((newFiles: FileList | null) => {
    if (disabled) return;
    if (!newFiles) return

    const acceptedFiles = Array.from(newFiles).filter(
      (file) => file.type === "application/pdf"
    )

    if (acceptedFiles.length !== newFiles.length) {
      toast({
        title: "Invalid File Type",
        description: "Only PDF files are accepted.",
        variant: "destructive",
      })
    }
    
    setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...acceptedFiles];
        onFilesChange(updatedFiles);
        return updatedFiles;
    });

  }, [disabled, onFilesChange, toast]);

  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles.splice(index, 1);
        onFilesChange(newFiles);
        return newFiles;
    });
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFileChange(e.dataTransfer.files)
  }

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          multiple
          accept=".pdf"
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={disabled}
        />
        <UploadCloud className="w-12 h-12 text-muted-foreground" />
        <p className="mt-4 text-center text-muted-foreground">
          <span className="font-semibold text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground/80">PDF files only (up to 500)</p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2">
          <h4 className="font-semibold text-sm">Selected Files:</h4>
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-md bg-muted/50"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <File className="h-5 w-5 flex-shrink-0" />
                <span className="truncate text-sm">{file.name}</span>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="p-1 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                aria-label="Remove file"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
