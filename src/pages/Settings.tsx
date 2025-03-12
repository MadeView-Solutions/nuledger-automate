
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Eye, EyeOff, RefreshCw, Shield } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Settings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem("nuledger_api_key"));
  const [showApiKey, setShowApiKey] = useState(false);
  
  const generateApiKey = () => {
    // In a real application, this would be generated on the server
    const newApiKey = "nl_" + Array.from({ length: 32 }, () => 
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 62)]
    ).join("");
    
    setApiKey(newApiKey);
    localStorage.setItem("nuledger_api_key", newApiKey);
    
    toast({
      title: "API Key Generated",
      description: "Your new API key has been generated successfully.",
    });
  };
  
  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast({
        title: "API Key Copied",
        description: "Your API key has been copied to clipboard.",
      });
    }
  };
  
  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };
  
  const revokeApiKey = () => {
    setApiKey(null);
    localStorage.removeItem("nuledger_api_key");
    
    toast({
      title: "API Key Revoked",
      description: "Your API key has been revoked successfully.",
    });
  };
  
  return (
    <DashboardLayout>
      <Container>
        <div className="py-8">
          <h1 className="text-2xl font-semibold mb-8">Settings</h1>
          
          <Tabs defaultValue="api-keys" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="api-keys">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-nuledger-500" />
                    API Keys
                  </CardTitle>
                  <CardDescription>
                    Manage your API keys for integration with other services or custom applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="mb-3 text-sm font-medium">Your API Key</div>
                      <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <Input 
                            type={showApiKey ? "text" : "password"} 
                            value={apiKey || "No API key generated"}
                            readOnly
                            className="pr-10 font-mono text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={toggleApiKeyVisibility}
                            disabled={!apiKey}
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={copyApiKey}
                          disabled={!apiKey}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">API Key Usage Guidelines</h3>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Never share your API key in public repositories or client-side code</li>
                        <li>• Use environment variables to store your API key in your applications</li>
                        <li>• Regenerate your API key if you suspect it has been compromised</li>
                        <li>• Each API key has a rate limit of 60 requests per minute</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={revokeApiKey}
                    disabled={!apiKey}
                  >
                    Revoke API Key
                  </Button>
                  <Button 
                    onClick={generateApiKey}
                    disabled={false}
                  >
                    {apiKey ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate API Key
                      </>
                    ) : (
                      <>Generate API Key</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account details and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Account settings will be implemented in a future update.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure how and when you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Notification settings will be implemented in a future update.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default Settings;
