import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, Link2, TrendingUp, Users, Shield } from "lucide-react";
import CaseLinkedExpenses from "@/components/expenses/CaseLinkedExpenses";
import DailySettlementFeed from "@/components/settlement/DailySettlementFeed";
import NegotiatorDashboard from "@/components/performance/NegotiatorDashboard";
import TrustComplianceAlerts from "@/components/trust/TrustComplianceAlerts";

const ExpenseManagement = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Expense & Performance Management</h1>
            <p className="text-muted-foreground">
              Comprehensive expense tracking, settlement monitoring, and performance analytics
            </p>
          </div>
        </div>

        <Tabs defaultValue="expenses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Case Expenses</span>
              <span className="sm:hidden">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="settlements" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Settlement Feed</span>
              <span className="sm:hidden">Settlements</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Performance</span>
              <span className="sm:hidden">Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Trust Alerts</span>
              <span className="sm:hidden">Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses">
            <CaseLinkedExpenses />
          </TabsContent>

          <TabsContent value="settlements">
            <DailySettlementFeed />
          </TabsContent>

          <TabsContent value="performance">
            <NegotiatorDashboard />
          </TabsContent>

          <TabsContent value="compliance">
            <TrustComplianceAlerts />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ExpenseManagement;