import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertCircle, RefreshCw, Settings, Building, Users, RotateCcw } from "lucide-react";
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
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState("daily");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState({
    successRate: 85,
    totalSyncs: 24,
    successfulSyncs: 20,
    failedSyncs: 4,
    lastSync: new Date().toISOString()
  });

  useEffect(() => {
    checkConnection();
    loadSyncConfig();
  }, []);

  useEffect(() => {
    if (syncConfig) {
      setAutoSync(syncConfig.auto_sync_enabled || false);
      setSyncInterval(syncConfig.sync_frequency || "daily");
    }
  }, [syncConfig]);

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

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      const result = await filevineService.syncAllCases();
      setSyncStats(prev => ({
        ...prev,
        totalSyncs: prev.totalSyncs + result.success + result.failed,
        successfulSyncs: prev.successfulSyncs + result.success,
        failedSyncs: prev.failedSyncs + result.failed,
        successRate: Math.round(((prev.successfulSyncs + result.success) / (prev.totalSyncs + result.success + result.failed)) * 100),
        lastSync: new Date().toISOString()
      }));
      
      if (result.success > 0) {
        toast.success(`Successfully synced ${result.success} cases`);
      }
      if (result.failed > 0) {
        toast.error(`Failed to sync ${result.failed} cases`);
      }
    } catch (error) {
      toast.error("Sync failed. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAutoSyncToggle = async (enabled: boolean) => {
    setAutoSync(enabled);
    
    try {
      await supabase
        .from('sync_config')
        .upsert({ 
          auto_sync_enabled: enabled,
          sync_frequency: syncInterval
        });
      
      toast.success(`Auto-sync ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update sync settings');
    }
  };

  const handleSyncIntervalChange = async (interval: string) => {
    setSyncInterval(interval);
    
    try {
      await supabase
        .from('sync_config')
        .upsert({
          auto_sync_enabled: autoSync,
          sync_frequency: interval
        });
      
      toast.success('Sync frequency updated');
    } catch (error) {
      toast.error('Failed to update sync frequency');
    }
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
      {/* Sync Now Button */}
      <div className="flex justify-end">
        <Button 
          disabled={!isConnected || isSyncing} 
          onClick={handleSyncNow}
          size="lg"
        >
          <RotateCcw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>

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

      {/* Sync Settings */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Auto-Sync Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoSync" className="text-base font-medium">Automatic Sync</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically sync case updates and financial data
                </p>
              </div>
              <Switch
                id="autoSync"
                checked={autoSync}
                onCheckedChange={handleAutoSyncToggle}
              />
            </div>

            {autoSync && (
              <div className="space-y-2">
                <Label>Sync Frequency</Label>
                <Select value={syncInterval} onValueChange={handleSyncIntervalChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Every Hour</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sync Statistics */}
      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Success Rate</CardTitle>
              <div className="text-2xl font-bold text-green-600">{syncStats.successRate}%</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Successful Syncs</CardTitle>
              <div className="text-2xl font-bold">{syncStats.successfulSyncs}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Failed Syncs</CardTitle>
              <div className="text-2xl font-bold text-red-600">{syncStats.failedSyncs}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Last Sync</CardTitle>
              <div className="text-lg font-bold">
                {new Date(syncStats.lastSync).toLocaleString()}
              </div>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;