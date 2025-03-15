
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TaxCalculator from "@/components/tax/TaxCalculator";
import TaxForms from "@/components/tax/TaxForms";
import AuditTrail from "@/components/tax/AuditTrail";
import TaxComplianceHeader from "@/components/tax/TaxComplianceHeader";
import TaxComplianceStats from "@/components/tax/TaxComplianceStats";
import TaxLawTracker from "@/components/tax/TaxLawTracker";
import TaxComplianceAPIs from "@/components/integrations/TaxComplianceAPIs";

const TaxCompliance = () => {
  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <TaxComplianceHeader />
        <div className="space-y-8">
          <TaxComplianceStats />
          
          <Tabs defaultValue="forms" className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="forms">Tax Forms</TabsTrigger>
              <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
              <TabsTrigger value="laws">Tax Law Updates</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
              <TabsTrigger value="integrations">IRS Connect</TabsTrigger>
            </TabsList>
            
            <TabsContent value="forms">
              <TaxForms />
            </TabsContent>
            
            <TabsContent value="calculator">
              <TaxCalculator />
            </TabsContent>
            
            <TabsContent value="laws">
              <TaxLawTracker />
            </TabsContent>
            
            <TabsContent value="audit">
              <AuditTrail />
            </TabsContent>
            
            <TabsContent value="integrations">
              <TaxComplianceAPIs />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default TaxCompliance;
