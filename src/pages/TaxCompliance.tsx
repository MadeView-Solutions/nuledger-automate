
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TaxCalculator from "@/components/tax/TaxCalculator";
import TaxForms from "@/components/tax/TaxForms";
import AuditTrail from "@/components/tax/AuditTrail";

const TaxCompliance = () => {
  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">AI-Driven Tax Compliance & Filing</h1>
          <div className="flex space-x-3">
            <Button variant="outline">Export Data</Button>
            <Button>Start New Filing</Button>
          </div>
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
            <TabsTrigger value="forms">Tax Forms</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator">
            <TaxCalculator />
          </TabsContent>
          
          <TabsContent value="forms">
            <TaxForms />
          </TabsContent>
          
          <TabsContent value="audit">
            <AuditTrail />
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default TaxCompliance;
