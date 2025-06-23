export interface ResumeResult {
  id: string;
  fileName: string;
  fileUrl: string;
  candidateName: string;
  email: string;
  matchScore: number;
  topMatchedSkills: string[];
  resumeText: string;
}
