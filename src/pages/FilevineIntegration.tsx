import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, RefreshCw, Settings, RotateCcw, AlertTriangle, Download, Users, Building } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FilevineCase } from "@/types/legal";
import { filevineService, type FilevineAuthResponse } from "@/services/filevineService";
import { toast } from "sonner";

const FilevineIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState("daily");
  const [authData, setAuthData] = useState<FilevineAuthResponse | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [cases, setCases] = useState<any[]>([]);
  const [syncStats, setSyncStats] = useState({
    successRate: 85,
    totalSyncs: 24,
    successfulSyncs: 20,
    failedSyncs: 4,
    lastSync: new Date().toISOString()
  });

  // Mock sync history with real sync data
  const [syncHistory, setSyncHistory] = useState<FilevineCase[]>([
    {
      filevineId: "FV001",
      caseId: "CASE001",
      lastSyncDate: "2024-07-25 14:30:00",
      syncStatus: "success"
    },
    {
      filevineId: "FV002", 
      caseId: "CASE002",
      lastSyncDate: "2024-07-25 14:25:00",
      syncStatus: "success"
    },
    {
      filevineId: "FV003",
      caseId: "CASE003", 
      lastSyncDate: "2024-07-25 14:20:00",
      syncStatus: "failed",
      errorMessage: "Invalid case status in Filevine"
    },
    {
      filevineId: "FV004",
      caseId: "CASE004",
      lastSyncDate: "2024-07-25 14:15:00", 
      syncStatus: "pending"
    }
  ]);

  // Check for existing connection on component mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      const result = await filevineService.testConnection();
      if (result.success) {
        setIsConnected(true);
        const authResult = await filevineService.authenticate();
        if (authResult.success) {
          setAuthData(authResult);
          if (authResult.userOrgs?.organizations.length) {
            const activeOrg = authResult.userOrgs.organizations.find(org => org.isActive);
            if (activeOrg) {
              setSelectedOrgId(activeOrg.orgId);
              filevineService.setActiveOrganization(activeOrg.orgId, authResult.userOrgs.userId);
            }
          }
        }
      }
    } catch (error) {
      console.log('No existing connection found');
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
        
        if (result.userOrgs?.organizations.length) {
          const activeOrg = result.userOrgs.organizations.find(org => org.isActive);
          if (activeOrg) {
            setSelectedOrgId(activeOrg.orgId);
            filevineService.setActiveOrganization(activeOrg.orgId, result.userOrgs.userId);
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

  const handleDisconnect = () => {
    setIsConnected(false);
    setAuthData(null);
    setSelectedOrgId("");
    setCases([]);
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

  const handleOrgChange = (orgId: string) => {
    setSelectedOrgId(orgId);
    if (authData?.userOrgs) {
      filevineService.setActiveOrganization(orgId, authData.userOrgs.userId);
    }
  };

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Success</Badge>;
      case "failed":
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Failed</Badge>;
      case "pending":
        return <Badge variant="secondary"><RefreshCw className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };


  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Filevine Integration</h1>
            <p className="text-muted-foreground">
              Sync case status and financial updates with Filevine
            </p>
          </div>
          <Button 
            disabled={!isConnected || isSyncing} 
            onClick={handleSyncNow}
          >
            <RotateCcw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Connection Settings
            </CardTitle>
            <CardDescription>
              Connect to Filevine using Personal Access Token (PAT) authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Connect to Filevine to enable automatic case and financial data synchronization.
                  Make sure your environment variables are configured: FILEVINE_CLIENT_ID, FILEVINE_CLIENT_SECRET, and FILEVINE_PAT.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Successfully connected to Filevine. Auto-sync is {autoSync ? "enabled" : "disabled"}.
                  {authData?.userOrgs && (
                    <span className="block mt-1">
                      Found {authData.userOrgs.organizations.length} organization(s).
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Connection Status</Label>
                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Disconnected
                    </Badge>
                  )}
                </div>
              </div>

              {isConnected && authData?.userOrgs && (
                <div className="space-y-2">
                  <Label>Active Organization</Label>
                  <Select value={selectedOrgId} onValueChange={handleOrgChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {authData.userOrgs.organizations.map((org) => (
                        <SelectItem key={org.orgId} value={org.orgId}>
                          <div className="flex items-center">
                            <Building className="w-4 h-4 mr-2" />
                            {org.orgName}
                            {org.isActive && <span className="ml-2 text-green-600">(Active)</span>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

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
          </CardContent>
        </Card>

        {/* Sync Settings */}
        {isConnected && (
          <Card>
            <CardHeader>
              <CardTitle>Sync Settings</CardTitle>
              <CardDescription>Configure automatic synchronization preferences</CardDescription>
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
                  onCheckedChange={setAutoSync}
                />
              </div>

              {autoSync && (
                <div className="space-y-2">
                  <Label>Sync Frequency</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(e.target.value)}
                  >
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
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
                <CardDescription>Success Rate</CardDescription>
                <CardTitle className="text-2xl text-green-600">{syncStats.successRate}%</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Successful Syncs</CardDescription>
                <CardTitle className="text-2xl">{syncStats.successfulSyncs}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Failed Syncs</CardDescription>
                <CardTitle className="text-2xl text-red-600">{syncStats.failedSyncs}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Sync</CardDescription>
                <CardTitle className="text-lg">
                  {new Date(syncStats.lastSync).toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Sync History */}
        {isConnected && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Sync Activity</CardTitle>
              <CardDescription>History of case synchronizations with Filevine</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filevine Case ID</TableHead>
                    <TableHead>NuLedger Case ID</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Error Message</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncHistory.map((sync) => (
                    <TableRow key={sync.filevineId}>
                      <TableCell className="font-mono">{sync.filevineId}</TableCell>
                      <TableCell className="font-mono">{sync.caseId}</TableCell>
                      <TableCell>{sync.lastSyncDate}</TableCell>
                      <TableCell>{getSyncStatusBadge(sync.syncStatus)}</TableCell>
                      <TableCell className="text-red-600 text-sm">
                        {sync.errorMessage || "—"}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Integration Guide */}
        {!isConnected && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Setup Instructions
              </CardTitle>
              <CardDescription>Configure your Filevine integration with NuLedger</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                  Generate Personal Access Token (PAT)
                </h4>
                <p className="text-sm text-muted-foreground ml-8">
                  Log into your Filevine account → Settings → API → Personal Access Tokens.
                  Create a new token with the following permissions:
                </p>
                <ul className="text-sm text-muted-foreground ml-8 list-disc list-inside space-y-1">
                  <li>Cases: Read, Write</li>
                  <li>Contacts: Read, Write</li>
                  <li>Financial: Read, Write (if needed)</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                  Configure Environment Variables
                </h4>
                <p className="text-sm text-muted-foreground ml-8">
                  Add these environment variables to your Supabase project:
                </p>
                <div className="ml-8 bg-muted p-3 rounded-md font-mono text-sm">
                  <div>FILEVINE_CLIENT_ID=your_client_id</div>
                  <div>FILEVINE_CLIENT_SECRET=your_client_secret</div>
                  <div>FILEVINE_PAT=your_personal_access_token</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
                  Test Connection
                </h4>
                <p className="text-sm text-muted-foreground ml-8">
                  Click "Connect to Filevine" above to establish the connection and verify your setup.
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Note:</strong> All API credentials are securely stored as environment variables 
                  and never exposed in your frontend code. The integration uses OAuth2 with automatic token refresh.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FilevineIntegration;