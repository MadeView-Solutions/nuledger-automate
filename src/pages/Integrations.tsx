
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AccountingSoftware from "@/components/integrations/AccountingSoftware";
import BankingPayments from "@/components/integrations/BankingPayments";
import TaxCompliance from "@/components/integrations/TaxComplianceAPIs";
import AIProcessing from "@/components/integrations/AIProcessing";
import IntegrationsSummary from "@/components/integrations/IntegrationsSummary";

const Integrations = () => {
  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Integrations & Third-Party APIs</h1>
          <div className="flex space-x-3">
            <Button variant="outline">View Documentation</Button>
            <Button>Add New Integration</Button>
          </div>
        </div>

        <div className="mb-8">
          <IntegrationsSummary />
        </div>

        <Tabs defaultValue="accounting" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="accounting">Accounting Software</TabsTrigger>
            <TabsTrigger value="banking">Banking & Payments</TabsTrigger>
            <TabsTrigger value="tax">Tax & Compliance</TabsTrigger>
            <TabsTrigger value="ai">AI & OCR Processing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounting">
            <AccountingSoftware />
          </TabsContent>
          
          <TabsContent value="banking">
            <BankingPayments />
          </TabsContent>
          
          <TabsContent value="tax">
            <TaxCompliance />
          </TabsContent>
          
          <TabsContent value="ai">
            <AIProcessing />
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default Integrations;
