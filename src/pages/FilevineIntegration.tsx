import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, CheckCircle, RefreshCw, Settings, RotateCcw, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FilevineCase } from "@/types/legal";

const FilevineIntegration = () => {
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState("daily");

  // Mock sync data
  const syncHistory: FilevineCase[] = [
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
  ];

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

  const successfulSyncs = syncHistory.filter(s => s.syncStatus === "success").length;
  const failedSyncs = syncHistory.filter(s => s.syncStatus === "failed").length;
  const syncSuccessRate = Math.round((successfulSyncs / syncHistory.length) * 100);

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
          <Button disabled={!isConnected}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Sync Now
          </Button>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Connection Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Connect to Filevine to enable automatic case and financial data synchronization.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Successfully connected to Filevine. Auto-sync is {autoSync ? "enabled" : "disabled"}.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">Filevine API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your Filevine API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Connection Status</Label>
                <div className="flex items-center space-x-2 mt-2">
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
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={() => setIsConnected(!isConnected)}
                variant={isConnected ? "outline" : "default"}
              >
                {isConnected ? "Disconnect" : "Connect to Filevine"}
              </Button>
              {isConnected && (
                <Button variant="outline">
                  Test Connection
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
                <CardTitle className="text-2xl text-green-600">{syncSuccessRate}%</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Successful Syncs</CardDescription>
                <CardTitle className="text-2xl">{successfulSyncs}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Failed Syncs</CardDescription>
                <CardTitle className="text-2xl text-red-600">{failedSyncs}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Sync</CardDescription>
                <CardTitle className="text-lg">2 min ago</CardTitle>
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
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>How to connect NuLedger with Filevine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">1. Get your Filevine API Key</h4>
                <p className="text-sm text-muted-foreground">
                  Log into your Filevine account and navigate to Settings → API to generate an API key.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">2. Configure Permissions</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure your API key has permissions to read and write case data and financial information.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">3. Test Connection</h4>
                <p className="text-sm text-muted-foreground">
                  Enter your API key above and click "Connect to Filevine" to establish the connection.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FilevineIntegration;