
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AccountsOverview from "@/components/reconciliation/AccountsOverview";
import ReconciliationPanel from "@/components/reconciliation/ReconciliationPanel";
import ReconciliationHistory from "@/components/reconciliation/ReconciliationHistory";
import { useToast } from "@/components/ui/use-toast";

const BankReconciliation = () => {
  const { toast } = useToast();

  const handleRefreshAccounts = () => {
    toast({
      title: "Account Sync Started",
      description: "Refreshing all connected accounts. This may take a moment.",
      duration: 3000,
    });
  };

  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">AI-Driven Bank Reconciliation</h1>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleRefreshAccounts}>Refresh Accounts</Button>
            <Button>Start Auto-Reconciliation</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">Accounts Overview</TabsTrigger>
            <TabsTrigger value="reconcile">Reconcile Transactions</TabsTrigger>
            <TabsTrigger value="history">Reconciliation History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <AccountsOverview />
          </TabsContent>
          
          <TabsContent value="reconcile">
            <ReconciliationPanel />
          </TabsContent>
          
          <TabsContent value="history">
            <ReconciliationHistory />
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default BankReconciliation;
