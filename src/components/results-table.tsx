"use client"

import { useState, useMemo } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Eye, Download, ArrowDown, ArrowUp } from 'lucide-react'
import { type ResumeResult } from '@/types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


interface ResultsTableProps {
  results: ResumeResult[]
}

type SortKey = keyof ResumeResult | null
type SortDirection = 'asc' | 'desc'

export function ResultsTable({ results }: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('matchScore')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const sortedResults = useMemo(() => {
    if (!sortKey) return results

    return [...results].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [results, sortKey, sortDirection])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const renderSortArrow = (key: SortKey) => {
    if (sortKey !== key) return null
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
  }

  if (results.length === 0) {
    return (
        <div className="w-full text-center p-8 border border-dashed rounded-lg mt-8">
            <p className="text-muted-foreground">Your screening results will appear here.</p>
        </div>
    )
  }

  return (
    <div className="w-full mt-8">
        <h2 className="text-2xl font-headline font-bold">Screening Results</h2>
        <div className="mt-4 rounded-lg border">
            <TooltipProvider>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('candidateName')} className="px-2">
                            Candidate Name {renderSortArrow('candidateName')}
                        </Button>
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort('matchScore')} className="px-2">
                            Match Score {renderSortArrow('matchScore')}
                        </Button>
                    </TableHead>
                    <TableHead>Top Matched Skills</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {sortedResults.map((result) => (
                    <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.candidateName}</TableCell>
                    <TableCell className="text-muted-foreground">{result.email}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Progress value={result.matchScore} className="h-2 w-24 bg-accent/20" indicatorClassName="bg-accent" />
                            <span className="text-sm font-medium">{result.matchScore}%</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                        {result.topMatchedSkills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                {skill}
                            </Badge>
                        ))}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" asChild>
                                    <a href={result.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <Eye className="h-4 w-4" />
                                    </a>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View Resume</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" asChild>
                                    <a href={result.fileUrl} download={result.fileName}>
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Download Resume</p>
                            </TooltipContent>
                        </Tooltip>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TooltipProvider>
        </div>
    </div>
  )
}
