
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle, 
  Brain,
  BarChart2,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ComplianceReadinessScore from "./ComplianceReadinessScore";
import DocumentationChecklist from "./DocumentationChecklist";

const AuditPreparationDashboard = () => {
  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl">
                Audit Preparation Dashboard
                <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-950">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </CardTitle>
              <CardDescription>
                Comprehensive audit readiness tools and compliance tracking
              </CardDescription>
            </div>
            <Button>
              Generate Audit Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <AuditMetricCard
              title="Audit Readiness"
              value="86%"
              trend="+12% from last assessment"
              icon={ClipboardCheck}
              color="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            />
            <AuditMetricCard
              title="Risk Factors"
              value="3 Areas"
              trend="5 issues resolved"
              icon={AlertTriangle}
              color="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
            />
            <AuditMetricCard
              title="Documentation Status"
              value="92% Complete"
              trend="8 docs pending"
              icon={FileCheck}
              color="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ComplianceReadinessScore />
            </div>
            <div className="lg:col-span-2">
              <DocumentationChecklist />
            </div>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                  Risk Assessment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <RiskFactorItem
                    title="Revenue Recognition"
                    status="attention"
                    description="Multi-year contracts need clearer documentation on revenue recognition criteria"
                  />
                  <RiskFactorItem
                    title="Expense Documentation"
                    status="compliant"
                    description="All business expenses properly categorized with adequate supporting documentation"
                  />
                  <RiskFactorItem
                    title="Tax Deduction Support"
                    status="attention"
                    description="Additional documentation needed for home office and vehicle expense deductions"
                  />
                  <RiskFactorItem
                    title="Employee Classification"
                    status="compliant"
                    description="All contractors and employees properly classified according to IRS guidelines"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface AuditMetricCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ElementType;
  color: string;
}

const AuditMetricCard: React.FC<AuditMetricCardProps> = ({ title, value, trend, icon: Icon, color }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-xl font-bold">{value}</h3>
          <div className="mt-2">
            <span className="text-sm text-muted-foreground">{trend}</span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

interface RiskFactorItemProps {
  title: string;
  status: "compliant" | "attention" | "critical";
  description: string;
}

const RiskFactorItem: React.FC<RiskFactorItemProps> = ({ title, status, description }) => {
  const getStatusDetails = () => {
    switch (status) {
      case "compliant":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
          label: "Compliant"
        };
      case "attention":
        return {
          icon: AlertTriangle,
          color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
          label: "Needs Attention"
        };
      case "critical":
        return {
          icon: AlertTriangle,
          color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
          label: "Critical Issue"
        };
      default:
        return {
          icon: CheckCircle,
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
          label: "Normal"
        };
    }
  };
  
  const { icon: StatusIcon, color, label } = getStatusDetails();
  
  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-0.5 p-1 rounded-full ${color}`}>
        <StatusIcon className="h-4 w-4" />
      </div>
      <div>
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium">{title}</h3>
          <Badge variant="outline" className={color}>{label}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
};

export default AuditPreparationDashboard;
