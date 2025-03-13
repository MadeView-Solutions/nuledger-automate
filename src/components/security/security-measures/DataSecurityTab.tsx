
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock, Key, Database, Fingerprint } from "lucide-react";
import SecurityFeatureCard from "./SecurityFeatureCard";

const DataSecurityTab: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SecurityFeatureCard
          icon={<Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          title="End-to-end Encryption"
          description="AES-256 encryption for all financial data, both in transit and at rest."
          iconBgClass="bg-blue-100 dark:bg-blue-900/30"
        />

        <SecurityFeatureCard
          icon={<Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          title="Secure API Integrations"
          description="OAuth 2.0 & TLS 1.2+ for secure connections with banking platforms."
          iconBgClass="bg-blue-100 dark:bg-blue-900/30"
        />

        <SecurityFeatureCard
          icon={<Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          title="Data Isolation"
          description="Tenant isolation ensures your financial data never intermingles with other accounts."
          iconBgClass="bg-blue-100 dark:bg-blue-900/30"
        />

        <SecurityFeatureCard
          icon={<Fingerprint className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          title="Biometric Authentication"
          description="Supports fingerprint and facial recognition for enhanced login security."
          iconBgClass="bg-blue-100 dark:bg-blue-900/30"
        />
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
          Security Certifications
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">ISO 27001</Badge>
          <Badge variant="secondary">FIPS 140-2</Badge>
          <Badge variant="secondary">PCI DSS</Badge>
          <Badge variant="secondary">NIST 800-53</Badge>
        </div>
      </div>
    </>
  );
};

export default DataSecurityTab;
