
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Message, getResponse } from "./types";

export const useChatbot = () => {
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
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
    setIsProcessing(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getResponse(input),
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsProcessing(false);
    }, 1500);
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

  const handleUseQuestion = (question: string) => {
    setInput(question);
    setShowHelp(false);
  };

  return {
    messages,
    input,
    setInput,
    isListening,
    isProcessing,
    showHelp,
    setShowHelp,
    messagesEndRef,
    handleSendMessage,
    handleKeyPress,
    toggleVoiceInput,
    handleUseQuestion,
  };
};
