
import React from "react";
import { Shield, ShieldAlert, Lock, Users, CheckCircle } from "lucide-react";
import SecurityFeatureCard from "./SecurityFeatureCard";

const FraudPreventionTab: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SecurityFeatureCard
          icon={<ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />}
          title="AI-driven Anomaly Detection"
          description="ML algorithms detect unusual financial patterns and potential fraud."
          iconBgClass="bg-red-100 dark:bg-red-900/30"
        />

        <SecurityFeatureCard
          icon={<Lock className="h-5 w-5 text-red-600 dark:text-red-400" />}
          title="Multi-factor Authentication"
          description="Enhanced security with MFA for all account access."
          iconBgClass="bg-red-100 dark:bg-red-900/30"
        />

        <SecurityFeatureCard
          icon={<Users className="h-5 w-5 text-red-600 dark:text-red-400" />}
          title="Role-based Access Control"
          description="Granular permissions limit data access to authorized personnel only."
          iconBgClass="bg-red-100 dark:bg-red-900/30"
        />

        <SecurityFeatureCard
          icon={<Shield className="h-5 w-5 text-red-600 dark:text-red-400" />}
          title="24/7 Security Monitoring"
          description="Constant surveillance of system activities and access attempts."
          iconBgClass="bg-red-100 dark:bg-red-900/30"
        />
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
          Last Security Assessment
        </h3>
        <p className="text-sm text-muted-foreground">
          System-wide security assessment completed on {new Date().toLocaleDateString()}. 
          No vulnerabilities detected.
        </p>
      </div>
    </>
  );
};

export default FraudPreventionTab;
