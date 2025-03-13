
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataSecurityTab from "./DataSecurityTab";
import ComplianceTab from "./ComplianceTab";
import FraudPreventionTab from "./FraudPreventionTab";

const SecurityMeasuresTabs: React.FC = () => {
  return (
    <Tabs defaultValue="data-security" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="data-security">Data Security</TabsTrigger>
        <TabsTrigger value="compliance">Regulatory Compliance</TabsTrigger>
        <TabsTrigger value="fraud">Fraud Prevention</TabsTrigger>
      </TabsList>

      {/* Data Security & Encryption Tab */}
      <TabsContent value="data-security" className="space-y-4">
        <DataSecurityTab />
      </TabsContent>

      {/* Regulatory Compliance Tab */}
      <TabsContent value="compliance" className="space-y-4">
        <ComplianceTab />
      </TabsContent>

      {/* Fraud Prevention Tab */}
      <TabsContent value="fraud" className="space-y-4">
        <FraudPreventionTab />
      </TabsContent>
    </Tabs>
  );
};

export default SecurityMeasuresTabs;
