
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { parseFinancialEntry, FinancialEntry } from "@/utils/voiceUtils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import VoiceControl from "./voice/VoiceControl";
import TranscriptDisplay from "./voice/TranscriptDisplay";
import ProcessingIndicator from "./voice/ProcessingIndicator";
import ParsedEntryDisplay from "./voice/ParsedEntryDisplay";
import VoiceHelp from "./voice/VoiceHelp";

const VoiceToAccounting = () => {
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedEntry, setParsedEntry] = useState<FinancialEntry | null>(null);
  const { toast } = useToast();

  const processTranscript = async () => {
    if (!transcript.trim()) {
      toast({
        title: "No speech detected",
        description: "Please speak a financial entry before processing.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const parsedResult = await parseFinancialEntry(transcript);
      setParsedEntry(parsedResult);
      
      toast({
        title: "Entry Processed",
        description: "Your financial entry has been processed successfully.",
      });
    } catch (error) {
      console.error("Error processing transcript:", error);
      toast({
        title: "Processing Error",
        description: "Failed to process your entry. Please try again with clearer instructions.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const saveEntry = () => {
    if (!parsedEntry) return;
    
    // In a real app, this would save to a database
    toast({
      title: "Entry Saved",
      description: `Your ${parsedEntry.type} entry for $${parsedEntry.amount} has been saved.`,
    });
    
    // Reset the component
    setTranscript("");
    setParsedEntry(null);
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
          Voice-to-Accounting
        </CardTitle>
        <CardDescription>
          Speak your financial entries and let AI convert them to structured records
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <VoiceControl 
          isListening={isListening}
          isProcessing={isProcessing}
          onStartListening={startListening}
          onStopListening={stopListening}
        />

        <TranscriptDisplay 
          transcript={transcript}
          isProcessing={isProcessing}
          parsedEntry={parsedEntry}
          onProcessTranscript={processTranscript}
        />

        <ProcessingIndicator isProcessing={isProcessing} />

        <ParsedEntryDisplay 
          parsedEntry={parsedEntry}
          onSaveEntry={saveEntry}
        />
      </CardContent>
      <CardFooter className="bg-muted/50 border-t px-6 py-3">
        <VoiceHelp />
      </CardFooter>
    </Card>
  );
};

export default VoiceToAccounting;
