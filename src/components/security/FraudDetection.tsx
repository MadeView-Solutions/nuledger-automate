
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { ShieldAlert, Activity, AlertTriangle, Zap, Shield } from "lucide-react";

// Mock fraud detection data
const fraudAlerts = [
  {
    id: "fraud-1",
    severity: "high",
    description: "Unusual login attempt detected from unrecognized IP address",
    timestamp: "2023-06-16T08:45:23",
    status: "unresolved",
  },
  {
    id: "fraud-2",
    severity: "medium",
    description: "Multiple large transactions in short timeframe",
    timestamp: "2023-06-15T14:12:09",
    status: "resolved",
  },
  {
    id: "fraud-3",
    severity: "low",
    description: "New vendor payment pattern detected",
    timestamp: "2023-06-14T11:30:15",
    status: "monitoring",
  },
];

// Mock risk score data
const riskScoreData = {
  overall: 82,
  previousScore: 65,
  categories: {
    transactionSecurity: 78,
    userAuthentication: 91,
    dataProtection: 84,
    vendorRisk: 73,
  },
};

const FraudDetection = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);

  const handleScanNow = () => {
    setIsScanning(true);
    toast({
      title: "Fraud Detection Scan Started",
      description: "AI is analyzing your transactions and activities for potential fraud patterns.",
      duration: 3000,
    });

    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Scan Completed",
        description: "No new fraud indicators detected in your recent activities.",
        duration: 3000,
      });
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unresolved":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "monitoring":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center">
              Fraud Detection & Risk Management
              <Badge variant="outline" className="ml-2 bg-red-50 dark:bg-red-950">
                <ShieldAlert className="h-3 w-3 mr-1" />
                AI Protected
              </Badge>
            </CardTitle>
            <CardDescription>
              Real-time monitoring and analysis of financial activities
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleScanNow}
            disabled={isScanning}
            className="w-full md:w-auto"
          >
            {isScanning ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-pulse" />
                Scanning...
              </>
            ) : (
              <>
                <ShieldAlert className="mr-2 h-4 w-4" />
                Scan Now
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Risk Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium">Overall Risk Score</h3>
                <Badge
                  className={
                    riskScoreData.overall > 80
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : riskScoreData.overall > 50
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }
                >
                  {riskScoreData.overall}/100
                </Badge>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  <div
                    style={{ width: `${riskScoreData.overall}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 dark:bg-green-400"
                  ></div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-green-600 dark:text-green-400">
                  ↑ {riskScoreData.overall - riskScoreData.previousScore}%
                </span>{" "}
                improvement from previous assessment
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(riskScoreData.categories).map(([key, value]) => (
                <div key={key} className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">{value}%</p>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        value > 80
                          ? "bg-green-500"
                          : value > 50
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Section */}
          <div>
            <h3 className="text-sm font-medium mb-3">Recent Alerts</h3>
            <div className="space-y-3">
              {fraudAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="border rounded-lg p-4 flex flex-col md:flex-row justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-full p-2 ${
                        alert.severity === "high"
                          ? "bg-red-100 dark:bg-red-900/30"
                          : alert.severity === "medium"
                          ? "bg-amber-100 dark:bg-amber-900/30"
                          : "bg-blue-100 dark:bg-blue-900/30"
                      }`}
                    >
                      <AlertTriangle
                        className={`h-4 w-4 ${
                          alert.severity === "high"
                            ? "text-red-600 dark:text-red-400"
                            : alert.severity === "medium"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Tip Alert */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Security Tip</AlertTitle>
            <AlertDescription>
              Enable two-factor authentication for all financial accounts to significantly enhance your security posture.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="text-sm text-muted-foreground">
          AI continuously monitors for suspicious patterns and anomalies in real-time
        </div>
      </CardFooter>
    </Card>
  );
};

export default FraudDetection;
