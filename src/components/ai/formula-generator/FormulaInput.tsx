
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { suggestedPrompts } from "./formula-utils";

interface FormulaInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  handleGenerateFormula: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const FormulaInput: React.FC<FormulaInputProps> = ({
  prompt,
  setPrompt,
  isGenerating,
  handleGenerateFormula,
  handleKeyPress,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Textarea
          placeholder="Describe the formula you need in plain English (e.g., 'Calculate monthly revenue growth')"
          className="min-h-[80px] resize-none pr-12"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button
          size="sm"
          className="absolute right-2 bottom-2"
          onClick={handleGenerateFormula}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {suggestedPrompts.map((suggestedPrompt) => (
          <Button
            key={suggestedPrompt}
            variant="outline"
            size="sm"
            onClick={() => setPrompt(suggestedPrompt)}
            className="text-xs"
          >
            {suggestedPrompt}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FormulaInput;
