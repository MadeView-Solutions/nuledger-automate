
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const complianceItems = [
  {
    title: "Tax Withholding",
    status: "compliant",
    message: "All tax withholdings are up to date and compliant with current regulations.",
    icon: CheckCircle2,
  },
  {
    title: "Benefits Deductions",
    status: "compliant",
    message: "All benefit deductions are correctly calculated and applied.",
    icon: CheckCircle2,
  },
  {
    title: "Labor Law Compliance",
    status: "warning",
    message: "Overtime calculations need review for 3 employees.",
    icon: AlertTriangle,
  },
  {
    title: "Payroll Tax Filing",
    status: "compliant",
    message: "Q2 tax filings complete. Q3 preparations in progress.",
    icon: CheckCircle2,
  },
];

const PayrollCompliance = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
          Compliance Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complianceItems.map((item) => (
            <div key={item.title} className="flex items-start space-x-3">
              <div 
                className={cn(
                  "mt-0.5 p-1 rounded-full",
                  item.status === "warning" 
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" 
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollCompliance;
