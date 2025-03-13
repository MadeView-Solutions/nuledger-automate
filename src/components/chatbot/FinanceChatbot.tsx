
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Bot, Send, Mic, MicOff, MessageSquareText } from "lucide-react";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

// Sample pre-defined responses
const botResponses: Record<string, string> = {
  "hello": "Hello! I'm your AI financial assistant. How can I help you today?",
  "help": "I can help with financial queries, accounting questions, tax information, and more. Just ask away!",
  "tax deadline": "For most individuals in the US, the tax filing deadline is April 15th. However, if this falls on a weekend or holiday, it may be extended to the next business day.",
  "profit margin": "Profit margin is calculated by dividing your net profit by revenue, then multiplying by 100 to get a percentage. This shows how much of each dollar in revenue becomes profit.",
  "cash flow": "Cash flow is the net amount of cash moving in and out of your business. Positive cash flow indicates more money coming in than going out, which is essential for financial stability.",
  "depreciation": "Depreciation is an accounting method to allocate the cost of a tangible asset over its useful life. It represents how much of an asset's value has been used up over time.",
  "invoice": "I can help you create and manage invoices through our invoicing system. Would you like me to show you how to create a new invoice?",
  "balance sheet": "A balance sheet provides a snapshot of your company's financial position at a specific point in time, showing assets, liabilities, and equity."
};

// Get response based on user input
const getResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Check for exact matches
  for (const [key, value] of Object.entries(botResponses)) {
    if (lowercaseInput.includes(key)) {
      return value;
    }
  }
  
  // Default responses if no match found
  if (lowercaseInput.includes("thank")) {
    return "You're welcome! Is there anything else I can help you with?";
  } else if (lowercaseInput.includes("?")) {
    return "That's a good question. While I don't have the specific answer right now, I can help you analyze your financial data to find this information. Would you like me to do that?";
  } else {
    return "I'm not sure I understand. Could you rephrase your question about your financial situation or accounting needs?";
  }
};

const FinanceChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      content: "Hello! I'm your AI financial assistant. How can I help with your finances today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // Simulate AI thinking
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getResponse(input),
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      // Check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        toast({
          title: "Voice Input Not Supported",
          description: "Your browser doesn't support voice input. Please type your message instead.",
          variant: "destructive",
        });
        return;
      }
      
      setIsListening(true);
      
      // Simulate voice recognition for demo purposes
      toast({
        title: "Listening...",
        description: "Speak now. Your voice is being processed.",
        duration: 2000,
      });
      
      setTimeout(() => {
        setIsListening(false);
        setInput("What's my current profit margin?");
        
        toast({
          title: "Voice Processed",
          description: "Your voice has been processed successfully.",
          duration: 2000,
        });
      }, 3000);
    } else {
      setIsListening(false);
      toast({
        title: "Voice Input Stopped",
        description: "Voice input has been cancelled.",
        duration: 2000,
      });
    }
  };

  return (
    <Card className="border-border shadow-sm h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              Finance AI Assistant
              <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-950">
                <Bot className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </CardTitle>
            <CardDescription>
              Ask anything about your finances or accounting
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <div className="h-[300px] overflow-y-auto pr-2 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
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
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="w-full mt-2 text-xs text-muted-foreground">
          <p>Try asking: "What's my profit margin?" or "When is the tax deadline?"</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FinanceChatbot;
