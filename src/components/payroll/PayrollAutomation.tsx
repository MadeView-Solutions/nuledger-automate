
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import PayrollSummary from "./PayrollSummary";
import PayrollCompliance from "./PayrollCompliance";
import UpcomingPayroll from "./UpcomingPayroll";

const PayrollAutomation = () => {
  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/50 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="flex items-center">
              AI-Powered Payroll & HR Automation
              <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-950">
                <Brain className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </CardTitle>
            <CardDescription>
              Automated salary calculations, tax withholdings, and benefits management
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <PayrollSummary />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UpcomingPayroll />
            <PayrollCompliance />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollAutomation;
