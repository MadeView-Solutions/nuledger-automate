import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, RefreshCw, Settings, Building, Users } from "lucide-react";
import { filevineService, type FilevineAuthResponse } from "@/services/filevineService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ConnectionStatusProps {}

const ConnectionStatus: React.FC<ConnectionStatusProps> = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [authData, setAuthData] = useState<FilevineAuthResponse | null>(null);
  const [syncConfig, setSyncConfig] = useState<any>(null);

  useEffect(() => {
    checkConnection();
    loadSyncConfig();
  }, []);

  const checkConnection = async () => {
    try {
      const result = await filevineService.testConnection();
      if (result.success) {
        setIsConnected(true);
        const authResult = await filevineService.authenticate();
        if (authResult.success) {
          setAuthData(authResult);
        }
      }
    } catch (error) {
      console.log('No existing connection found');
    }
  };

  const loadSyncConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('sync_config')
        .select('*')
        .limit(1)
        .single();
      
      if (!error && data) {
        setSyncConfig(data);
      }
    } catch (error) {
      console.log('No sync config found');
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const result = await filevineService.authenticate();
      if (result.success) {
        setIsConnected(true);
        setAuthData(result);
        toast.success("Successfully connected to Filevine!");
        
        // Update sync config with organization data
        if (result.userOrgs?.organizations.length) {
          const activeOrg = result.userOrgs.organizations.find(org => org.isActive);
          if (activeOrg) {
            await supabase
              .from('sync_config')
              .upsert({
                filevine_org_id: activeOrg.orgId,
                filevine_user_id: result.userOrgs.userId
              });
            filevineService.setActiveOrganization(activeOrg.orgId, result.userOrgs.userId);
            loadSyncConfig();
          }
        }
      } else {
        toast.error(result.error || "Failed to connect to Filevine");
      }
    } catch (error) {
      toast.error("Connection failed. Please check your configuration.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsConnected(false);
    setAuthData(null);
    await supabase
      .from('sync_config')
      .update({ filevine_org_id: null, filevine_user_id: null })
      .eq('id', syncConfig?.id);
    loadSyncConfig();
    toast.info("Disconnected from Filevine");
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await filevineService.testConnection();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Connection test failed");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Filevine API Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {isConnected ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p className="font-medium">
                  {isConnected ? "✅ Connected" : "❌ Not Connected"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isConnected 
                    ? "Filevine API is connected and ready for sync" 
                    : "Connect to Filevine to enable data synchronization"
                  }
                </p>
              </div>
            </div>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Organization & User Info */}
          {isConnected && authData?.userOrgs && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Organization ID</span>
                </div>
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  {syncConfig?.filevine_org_id || "Not set"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Active Filevine Organization
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">User ID</span>
                </div>
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  {syncConfig?.filevine_user_id || "Not set"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Authenticated Filevine User
                </p>
              </div>
            </div>
          )}

          {/* Connection Actions */}
          <div className="flex space-x-4">
            <Button 
              onClick={isConnected ? handleDisconnect : handleConnect}
              variant={isConnected ? "outline" : "default"}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : isConnected ? (
                "Disconnect"
              ) : (
                "Connect to Filevine"
              )}
            </Button>
            
            {isConnected && (
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
            )}
          </div>

          {/* Setup Instructions */}
          {!isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                To connect to Filevine, ensure your environment variables are configured:
                FILEVINE_CLIENT_ID, FILEVINE_CLIENT_SECRET, and FILEVINE_PAT.
                These can be obtained from your Filevine Settings → API → Personal Access Tokens.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionStatus;