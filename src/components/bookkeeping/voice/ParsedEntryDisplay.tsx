
import React from "react";
import { Button } from "@/components/ui/button";
import { FinancialEntry } from "@/utils/voiceUtils";

interface ParsedEntryDisplayProps {
  parsedEntry: FinancialEntry | null;
  onSaveEntry: () => void;
}

const ParsedEntryDisplay: React.FC<ParsedEntryDisplayProps> = ({
  parsedEntry,
  onSaveEntry
}) => {
  if (!parsedEntry) return null;
  
  return (
    <div className="border rounded-lg p-4 mt-4">
      <h3 className="font-medium mb-2">Processed Entry:</h3>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-muted-foreground">Type:</dt>
        <dd className="font-medium capitalize">{parsedEntry.type}</dd>
        
        <dt className="text-muted-foreground">Amount:</dt>
        <dd className="font-medium">${parsedEntry.amount.toFixed(2)}</dd>
        
        {parsedEntry.category && (
          <>
            <dt className="text-muted-foreground">Category:</dt>
            <dd className="font-medium">{parsedEntry.category}</dd>
          </>
        )}
        
        {parsedEntry.source && (
          <>
            <dt className="text-muted-foreground">Source:</dt>
            <dd className="font-medium">{parsedEntry.source}</dd>
          </>
        )}
        
        {parsedEntry.destination && (
          <>
            <dt className="text-muted-foreground">Destination:</dt>
            <dd className="font-medium">{parsedEntry.destination}</dd>
          </>
        )}
        
        {parsedEntry.date && (
          <>
            <dt className="text-muted-foreground">Date:</dt>
            <dd className="font-medium">{parsedEntry.date.toLocaleDateString()}</dd>
          </>
        )}
        
        <dt className="text-muted-foreground">Description:</dt>
        <dd className="font-medium">{parsedEntry.description}</dd>
      </dl>
      
      <div className="mt-4 flex justify-end">
        <Button variant="default" size="sm" onClick={onSaveEntry}>
          Save Entry
        </Button>
      </div>
    </div>
  );
};

export default ParsedEntryDisplay;
