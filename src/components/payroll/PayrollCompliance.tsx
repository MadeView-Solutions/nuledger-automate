
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle2, Users, Globe, Building, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const externalClientItems = [
  {
    title: "Tax Withholding",
    status: "compliant",
    message: "All client tax withholdings are up to date and compliant with current regulations.",
    icon: CheckCircle2,
  },
  {
    title: "Benefits Deductions",
    status: "compliant",
    message: "All client benefit deductions are correctly calculated and applied.",
    icon: CheckCircle2,
  },
];

const internationalComplianceItems = [
  {
    title: "Labor Law Compliance",
    status: "warning",
    message: "International overtime calculations need review for 3 employees.",
    icon: AlertTriangle,
  },
  {
    title: "Payroll Tax Filing",
    status: "compliant",
    message: "International Q2 tax filings complete. Q3 preparations in progress.",
    icon: CheckCircle2,
  },
];

const internalFirmItems = [
  {
    title: "Staff Payroll",
    status: "compliant",
    message: "All internal staff payroll processing is up to date and compliant.",
    icon: CheckCircle2,
  },
  {
    title: "Firm Tax Obligations",
    status: "warning",
    message: "Quarterly estimated tax payment due in 5 days.",
    icon: AlertTriangle,
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
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3 border-b pb-2">
              <Users className="h-4 w-4 text-green-600" />
              <h3 className="font-medium text-green-700">External Client Compliance</h3>
            </div>
            <div className="space-y-4">
              {externalClientItems.map((item) => (
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
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3 border-b pb-2">
              <Globe className="h-4 w-4 text-purple-600" />
              <h3 className="font-medium text-purple-700">International Compliance</h3>
            </div>
            <div className="space-y-4">
              {internationalComplianceItems.map((item) => (
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
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3 border-b pb-2">
              <Building className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium text-blue-700">Internal Firm Compliance</h3>
            </div>
            <div className="space-y-4">
              {internalFirmItems.map((item) => (
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollCompliance;
