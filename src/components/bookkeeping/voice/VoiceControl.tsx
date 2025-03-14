
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceControlProps {
  isListening: boolean;
  isProcessing: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  isListening,
  isProcessing,
  onStartListening,
  onStopListening
}) => {
  return (
    <div className="flex justify-center">
      <Button
        onClick={isListening ? onStopListening : onStartListening}
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
  );
};

export default VoiceControl;
