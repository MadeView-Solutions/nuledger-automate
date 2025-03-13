
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, FileCheck, FileWarning, Shield, AlertTriangle } from "lucide-react";

const auditEvents = [
  {
    id: 1,
    type: "compliance-check",
    title: "Compliance Verification",
    description: "AI verified all transactions comply with IRS guidelines",
    timestamp: "2024-02-15T10:30:00Z",
    status: "success",
    icon: Shield,
  },
  {
    id: 2,
    type: "form-generated",
    title: "Form 1040 Generated",
    description: "AI auto-filled Form 1040 based on financial data",
    timestamp: "2024-02-15T10:25:00Z",
    status: "success",
    icon: FileCheck,
  },
  {
    id: 3,
    type: "alert",
    title: "Missing Documentation",
    description: "Additional documentation needed for charitable contributions",
    timestamp: "2024-02-15T10:20:00Z",
    status: "warning",
    icon: FileWarning,
  },
  {
    id: 4,
    type: "risk-assessment",
    title: "Audit Risk Assessment",
    description: "AI analyzed filing for potential audit triggers",
    timestamp: "2024-02-15T10:15:00Z",
    status: "success",
    icon: Brain,
  },
  {
    id: 5,
    type: "alert",
    title: "Deduction Threshold",
    description: "Medical expenses below minimum threshold for deduction",
    timestamp: "2024-02-15T10:10:00Z",
    status: "warning",
    icon: AlertTriangle,
  },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "warning":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    case "error":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const AuditTrail = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Audit Trail</CardTitle>
        <CardDescription>
          Real-time tracking of compliance checks and tax filing activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {auditEvents.map((event) => (
            <div key={event.id} className="flex items-start space-x-4">
              <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center ${getStatusStyles(event.status)}`}>
                <event.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{event.title}</h4>
                  {event.type === "alert" && (
                    <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950">
                      Action Needed
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditTrail;
