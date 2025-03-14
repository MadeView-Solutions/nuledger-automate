
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { parseFinancialEntry } from "@/utils/voiceUtils";

interface FinancialEntry {
  type: "expense" | "income" | "transfer";
  amount: number;
  source?: string;
  destination?: string;
  date?: Date;
  category?: string;
  description: string;
}

const VoiceToAccounting = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedEntry, setParsedEntry] = useState<FinancialEntry | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please try a different browser.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setParsedEntry(null);
    };

    recognitionRef.current.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      
      setTranscript(currentTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      toast({
        title: "Recognition Error",
        description: `Error: ${event.error}. Please try again.`,
        variant: "destructive",
      });
      stopListening();
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

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
      // In a real implementation, this would call the OpenAI API or similar service
      // For now, we'll use a mock implementation
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
        <div className="flex justify-center">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
            size="lg"
            disabled={isProcessing}
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-5 w-5" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                Start Listening
              </>
            )}
          </Button>
        </div>

        {transcript && (
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
                  onClick={processTranscript}
                  disabled={isProcessing || !transcript}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Process Entry
                </Button>
              </div>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <div className="h-2 w-2 bg-primary rounded-full"></div>
            </div>
          </div>
        )}

        {parsedEntry && (
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
              <Button variant="default" size="sm" onClick={saveEntry}>
                Save Entry
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 border-t px-6 py-3">
        <div className="text-xs text-muted-foreground">
          <p>Try saying phrases like:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>"Log a $200 office expense from Staples on March 5th."</li>
            <li>"Transfer $5,000 from checking to payroll account."</li>
            <li>"Record $1,500 revenue from client XYZ for consulting."</li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VoiceToAccounting;
