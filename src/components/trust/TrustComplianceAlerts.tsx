import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Bell, Clock, DollarSign, Shield, CheckCircle } from "lucide-react";
import { TrustAlert } from "@/types/expense";
import { formatCurrency, formatDate } from "@/utils/formatters";

const TrustComplianceAlerts = () => {
  // Mock data
  const alerts: TrustAlert[] = [
    {
      id: "1",
      type: "balance_warning",
      severity: "high",
      message: "Trust account balance below minimum threshold for Smith vs. ABC Corp",
      caseId: "C001",
      amount: 2500,
      dueDate: "2024-01-30",
      resolved: false
    },
    {
      id: "2",
      type: "reconciliation_issue",
      severity: "medium",
      message: "Monthly reconciliation overdue by 3 days",
      resolved: false
    },
    {
      id: "3",
      type: "compliance_violation",
      severity: "critical",
      message: "Client funds mixed with operating account detected",
      caseId: "C002",
      amount: 15000,
      resolved: false
    },
    {
      id: "4",
      type: "balance_warning",
      severity: "low",
      message: "Settlement disbursement scheduled in 2 days - verify sufficient funds",
      caseId: "C003",
      amount: 85000,
      dueDate: "2024-01-27",
      resolved: true
    }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <Bell className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalCount = activeAlerts.filter(a => a.severity === "critical").length;
  const highCount = activeAlerts.filter(a => a.severity === "high").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Trust Compliance Alerts</h2>
          <p className="text-muted-foreground">
            Monitor trust account compliance and balance warnings
          </p>
        </div>
        <Button variant="outline">
          <Shield className="w-4 h-4 mr-2" />
          Run Compliance Check
        </Button>
      </div>

      {activeAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Attention Required:</strong> You have {criticalCount} critical and {highCount} high priority compliance alerts that need immediate attention.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">
              Immediate action needed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {criticalCount === 0 ? "Good" : "At Risk"}
            </div>
            <p className="text-xs text-muted-foreground">
              Overall status
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Check</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">
              Auto-check daily
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Alerts</CardTitle>
          <CardDescription>
            Trust account alerts and compliance notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`flex items-start justify-between p-4 border rounded-lg ${
                  alert.resolved ? "bg-muted/30" : "bg-background"
                }`}
              >
                <div className="flex items-start gap-3">
                  {alert.resolved ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    getSeverityIcon(alert.severity)
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(alert.severity) as any}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      {alert.resolved && (
                        <Badge variant="outline" className="text-green-600">
                          RESOLVED
                        </Badge>
                      )}
                    </div>
                    <p className={`font-medium ${alert.resolved ? "text-muted-foreground" : "text-foreground"}`}>
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {alert.caseId && (
                        <span>Case: {alert.caseId}</span>
                      )}
                      {alert.amount && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrency(alert.amount)}
                        </span>
                      )}
                      {alert.dueDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due: {formatDate(alert.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!alert.resolved && (
                    <>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        Resolve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrustComplianceAlerts;