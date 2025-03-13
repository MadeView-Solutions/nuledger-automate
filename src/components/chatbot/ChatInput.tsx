
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  toggleVoiceInput: () => void;
  isListening: boolean;
  isProcessing: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSendMessage,
  handleKeyPress,
  toggleVoiceInput,
  isListening,
  isProcessing,
}) => {
  return (
    <>
      <div className="flex w-full items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVoiceInput}
          className={isListening ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" : ""}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Input
          placeholder="Ask a financial question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-grow"
          disabled={isProcessing}
        />
        <Button size="icon" onClick={handleSendMessage} disabled={!input.trim() || isProcessing}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="w-full mt-2 text-xs text-muted-foreground">
        <p>Try asking: "What's my profit margin?" or "When is the tax deadline?"</p>
      </div>
    </>
  );
};

export default ChatInput;
