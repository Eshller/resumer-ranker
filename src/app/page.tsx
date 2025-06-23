import ResumeRanker from '@/components/resume-ranker';
import { Github } from 'lucide-react';

export default function Home() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          ResumeRank AI
        </h1>
        <p className="mt-2 text-base sm:text-lg md:text-xl text-muted-foreground">
          Upload resumes, paste a job description, and let AI find the best candidates for you.
        </p>
      </header>
      <ResumeRanker />
      <footer className="w-full max-w-5xl text-center mt-12 text-muted-foreground text-sm">
        <a 
          href="https://github.com/firebase/firebase-genkit-samples/tree/main/nextjs-resume-screener" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <Github size={16} />
          View on GitHub
        </a>
      </footer>
    </main>
  );
}
