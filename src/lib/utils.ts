import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractEmail(text: string): string {
  if (!text) return "Not found";
  const emailMatch = text.match(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi
  );
  return emailMatch ? emailMatch[0] : "Not found";
}

export function extractName(text: string): string {
  if (!text) return "Not found";
  
  // Try to find name at the beginning of the document
  const firstLines = text.substring(0, 200);
  const nameMatch = firstLines.match(/^([A-Z][a-z]+(?: [A-Z][a-zA-Z'-]+)*)/);
  
  if (nameMatch && nameMatch[0].length > 4) {
    const commonHeaders = ['curriculum', 'resume', 'summary', 'objective', 'experience', 'education', 'skills', 'profile'];
    if (!commonHeaders.some(header => nameMatch[0].toLowerCase().includes(header))) {
      return nameMatch[0];
    }
  }

  // Fallback for "Name: John Doe" format anywhere in the text
  const nameLabelMatch = text.match(/(?:name|candidat)\s*[:\n]\s*([A-Z][a-z]+(?: [A-Z][a-zA-Z'-]+)*)/i);
  if (nameLabelMatch) {
      return nameLabelMatch[1];
  }
  
  return "Not Found";
}
