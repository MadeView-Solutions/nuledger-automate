
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatMessage from "./ChatMessage";
import ThinkingIndicator from "./ThinkingIndicator";
import HelpContent from "./HelpContent";
import ChatInput from "./ChatInput";
import { useChatbot } from "./useChatbot";

const FinanceChatbot = () => {
  const isMobile = useIsMobile();
  const {
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
  } = useChatbot();

  return (
    <Card className="border-border shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2">
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
          {isMobile ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button size="sm" variant="outline" className="h-8">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Help
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Help & Suggestions</DrawerTitle>
                  <DrawerDescription>
                    Try asking one of these questions
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                  <HelpContent onSelectQuestion={handleUseQuestion} />
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <>
              <Button size="sm" variant="outline" className="h-8" onClick={() => setShowHelp(true)}>
                <HelpCircle className="h-4 w-4 mr-1" />
                Help
              </Button>
              <Dialog open={showHelp} onOpenChange={setShowHelp}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Help & Suggestions</DialogTitle>
                    <DialogDescription>
                      Try asking one of these questions
                    </DialogDescription>
                  </DialogHeader>
                  <HelpContent onSelectQuestion={handleUseQuestion} />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-4">
        <div className="h-[300px] overflow-y-auto pr-2 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isProcessing && <ThinkingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <ChatInput
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
          toggleVoiceInput={toggleVoiceInput}
          isListening={isListening}
          isProcessing={isProcessing}
        />
      </CardFooter>
    </Card>
  );
};

export default FinanceChatbot;
