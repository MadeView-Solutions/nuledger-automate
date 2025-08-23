import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VendorDirectory from "@/components/vendors/VendorDirectory";
import PayablesTracker from "@/components/vendors/PayablesTracker";
import ReductionRequestWorkflow from "@/components/settlement/ReductionRequestWorkflow";
import SettlementCalculator from "@/components/settlement/SettlementCalculator";
import DocumentUploadWithInstructions from "@/components/documents/DocumentUploadWithInstructions";
import { Building2, DollarSign, TrendingDown, FileText, Calculator } from "lucide-react";

const SettlementManagement = () => {
  const [activeTab, setActiveTab] = useState("calculator");

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settlement Management</h1>
          <p className="text-muted-foreground">
            Comprehensive tools for managing settlements, vendors, and document workflows
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Vendors
            </TabsTrigger>
            <TabsTrigger value="payables" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Payables
            </TabsTrigger>
            <TabsTrigger value="reductions" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Reductions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <SettlementCalculator />
          </TabsContent>

          <TabsContent value="vendors" className="space-y-6">
            <VendorDirectory />
          </TabsContent>

          <TabsContent value="payables" className="space-y-6">
            <PayablesTracker />
          </TabsContent>

          <TabsContent value="reductions" className="space-y-6">
            <ReductionRequestWorkflow />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettlementManagement;