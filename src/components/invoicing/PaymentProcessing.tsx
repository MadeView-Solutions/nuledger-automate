
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle, CreditCard, ArrowUpRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock payment activities
const recentActivities = [
  {
    id: "1",
    client: "Acme Corp",
    amount: 1250.00,
    date: "2023-06-15",
    type: "payment",
    status: "successful",
  },
  {
    id: "2",
    client: "Wayne Enterprises",
    amount: 4500.00,
    date: "2023-06-14",
    type: "payment",
    status: "successful",
  },
  {
    id: "3",
    client: "Unknown Source",
    amount: 850.00,
    date: "2023-06-13",
    type: "suspicious",
    status: "flagged",
  },
  {
    id: "4",
    client: "Stark Industries",
    amount: 3200.00,
    date: "2023-06-10",
    type: "payment",
    status: "processing",
  }
];

const PaymentProcessing = () => {
  const { toast } = useToast();

  const handleViewAllActivities = () => {
    toast({
      title: "Function Not Implemented",
      description: "View all payment activities functionality coming soon.",
      duration: 3000,
    });
  };

  const handleScanForFraud = () => {
    toast({
      title: "Fraud Detection Scan Started",
      description: "AI is scanning all payment activities for suspicious patterns.",
      duration: 5000,
    });
  };

  return (
    <Card className="border-border shadow-sm h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payment Processing</CardTitle>
            <CardDescription className="mt-1">
              Secure payment processing & fraud detection
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleScanForFraud}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Scan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30">
            <div className="flex items-center mb-2">
              <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <h3 className="font-medium text-green-800 dark:text-green-400">AI Fraud Protection</h3>
            </div>
            <p className="text-sm text-green-700 dark:text-green-400/80">
              AI monitors all payment activities for suspicious patterns. System is currently active and no threats detected.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Recent Activities</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleViewAllActivities}>
                View all
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-md border bg-background">
                  <div className="flex items-center">
                    <div className={`rounded-full p-1.5 mr-3 ${
                      activity.type === "suspicious" 
                        ? "bg-red-100 dark:bg-red-900/30" 
                        : "bg-blue-100 dark:bg-blue-900/30"
                    }`}>
                      {activity.type === "suspicious" ? (
                        <AlertTriangle className={`h-3.5 w-3.5 ${
                          activity.type === "suspicious" 
                            ? "text-red-600 dark:text-red-400" 
                            : "text-blue-600 dark:text-blue-400"
                        }`} />
                      ) : (
                        <CreditCard className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.client}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${activity.amount.toFixed(2)}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        activity.status === "successful" 
                          ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" 
                          : activity.status === "flagged" 
                          ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}
                    >
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-sm mb-2">Payment Reconciliation</h3>
            <div className="flex gap-2 items-center">
              <div className="h-2 bg-green-500 rounded-full flex-1"></div>
              <span className="text-xs text-muted-foreground">92% auto-reconciled</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              AI has automatically reconciled 92% of payments with invoices this month.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessing;
