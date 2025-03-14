
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface TranscriptDisplayProps {
  transcript: string;
  isProcessing: boolean;
  parsedEntry: any | null;
  onProcessTranscript: () => void;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  transcript,
  isProcessing,
  parsedEntry,
  onProcessTranscript
}) => {
  if (!transcript) return null;
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Transcript:</h3>
      <div className="bg-muted p-3 rounded-md text-muted-foreground">
        {transcript}
      </div>
      
      {!isProcessing && !parsedEntry && (
        <div className="mt-2 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onProcessTranscript}
            disabled={isProcessing || !transcript}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Process Entry
          </Button>
        </div>
      )}
    </div>
  );
};

export default TranscriptDisplay;
