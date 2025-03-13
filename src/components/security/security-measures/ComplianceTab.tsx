
import React from "react";
import { Badge } from "@/components/ui/badge";
import { FileCheck, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import SecurityFeatureCard from "./SecurityFeatureCard";

const ComplianceTab: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SecurityFeatureCard
          icon={<FileCheck className="h-5 w-5 text-green-600 dark:text-green-400" />}
          title="SOC 2 Compliance"
          description="Independently audited security controls and policies."
          iconBgClass="bg-green-100 dark:bg-green-900/30"
        />

        <SecurityFeatureCard
          icon={<FileText className="h-5 w-5 text-green-600 dark:text-green-400" />}
          title="GDPR & CCPA Compliance"
          description="Full compliance with global data protection regulations."
          iconBgClass="bg-green-100 dark:bg-green-900/30"
        />

        <SecurityFeatureCard
          icon={<AlertTriangle className="h-5 w-5 text-green-600 dark:text-green-400" />}
          title="AI Audit Logs"
          description="Comprehensive logging of all system activities for audit purposes."
          iconBgClass="bg-green-100 dark:bg-green-900/30"
        />

        <SecurityFeatureCard
          icon={<CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
          title="Real-time Compliance Tracking"
          description="Automatic monitoring of financial regulations and tax laws."
          iconBgClass="bg-green-100 dark:bg-green-900/30"
        />
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-medium mb-2">Compliance Documentation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Badge className="justify-center py-1.5" variant="outline">HIPAA</Badge>
          <Badge className="justify-center py-1.5" variant="outline">GDPR</Badge>
          <Badge className="justify-center py-1.5" variant="outline">CCPA</Badge>
          <Badge className="justify-center py-1.5" variant="outline">SOX</Badge>
        </div>
      </div>
    </>
  );
};

export default ComplianceTab;
