
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TaxCalculator from "@/components/tax/TaxCalculator";
import TaxForms from "@/components/tax/TaxForms";
import AuditTrail from "@/components/tax/AuditTrail";
import TaxComplianceHeader from "@/components/tax/TaxComplianceHeader";
import TaxComplianceStats from "@/components/tax/TaxComplianceStats";
import TaxLawTracker from "@/components/tax/TaxLawTracker";

const TaxCompliance = () => {
  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <TaxComplianceHeader />
        <div className="space-y-8">
          <TaxComplianceStats />
          
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
              <TabsTrigger value="laws">Tax Law Updates</TabsTrigger>
              <TabsTrigger value="forms">Tax Forms</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator">
              <TaxCalculator />
            </TabsContent>
            
            <TabsContent value="laws">
              <TaxLawTracker />
            </TabsContent>
            
            <TabsContent value="forms">
              <TaxForms />
            </TabsContent>
            
            <TabsContent value="audit">
              <AuditTrail />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default TaxCompliance;
