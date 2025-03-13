
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
      isTyping: false, // Added isTyping flag
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
      isTyping: false,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    
    // First add a temporary bot message with the isTyping flag
    const tempBotMessageId = (Date.now() + 1).toString();
    const response = getResponse(input);
    
    // Add empty message with typing indicator
    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        {
          id: tempBotMessageId,
          content: "", 
          sender: "bot",
          timestamp: new Date(),
          isTyping: true,
          fullContent: response // Store the full content to be animated
        }
      ]);
      
      // Start animating the typing effect
      let currentLength = 0;
      const typingInterval = setInterval(() => {
        if (!response) {
          clearInterval(typingInterval);
          return;
        }
        
        currentLength += 1;
        
        if (currentLength > response.length) {
          clearInterval(typingInterval);
          // Mark message as done typing
          setMessages(prev => 
            prev.map(msg => 
              msg.id === tempBotMessageId 
                ? { ...msg, isTyping: false, content: response } 
                : msg
            )
          );
          setIsProcessing(false);
        } else {
          // Update the message with more characters
          setMessages(prev => 
            prev.map(msg => 
              msg.id === tempBotMessageId 
                ? { ...msg, content: response.substring(0, currentLength) } 
                : msg
            )
          );
        }
      }, 15); // Adjust typing speed here
    }, 500);
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
