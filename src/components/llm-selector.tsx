"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Sparkles } from "lucide-react"

interface LLMSelectorProps {
    selectedLLM: 'gemini' | 'openai'
    onLLMChange: (llm: 'gemini' | 'openai') => void
    disabled?: boolean
}

export function LLMSelector({ selectedLLM, onLLMChange, disabled = false }: LLMSelectorProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <Label className="text-lg font-headline font-semibold mb-3 block">3. Choose AI Model</Label>
                <RadioGroup
                    value={selectedLLM}
                    onValueChange={(value) => onLLMChange(value as 'gemini' | 'openai')}
                    disabled={disabled}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gemini" id="gemini" />
                        <Label htmlFor="gemini" className="flex items-center gap-2 cursor-pointer">
                            <Sparkles className="h-4 w-4 text-blue-500" />
                            <div>
                                <div className="font-medium">Gemini 2.0 Flash</div>
                                <div className="text-sm text-muted-foreground">Google's latest model</div>
                            </div>
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="openai" id="openai" />
                        <Label htmlFor="openai" className="flex items-center gap-2 cursor-pointer">
                            <Brain className="h-4 w-4 text-green-500" />
                            <div>
                                <div className="font-medium">GPT-4o</div>
                                <div className="text-sm text-muted-foreground">OpenAI's latest model</div>
                            </div>
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    )
} 