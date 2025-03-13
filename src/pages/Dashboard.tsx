
import React from "react";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, Download } from "lucide-react";

// Import dashboard sections as separate components
import Overview from "@/components/dashboard/Overview";
import TransactionSection from "@/components/dashboard/TransactionSection";
import FinancialOverviewSection from "@/components/dashboard/FinancialOverviewSection";
import AIFeaturesSection from "@/components/dashboard/AIFeaturesSection";
import SecuritySection from "@/components/dashboard/SecuritySection";

const Dashboard = () => {
  const isMobile = useIsMobile();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <Container className="max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <div className="flex space-x-3">
              <Button variant="outline" size={isMobile ? "sm" : "default"} className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                <span>{isMobile ? "Export" : "Export Data"}</span>
              </Button>
              <Button size={isMobile ? "sm" : "default"} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                <span>New Transaction</span>
              </Button>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Financial KPIs Section */}
            <Overview />
            
            {/* Financial Overview Section with Stats and Activity */}
            <FinancialOverviewSection />
            
            {/* AI Features Section */}
            <AIFeaturesSection />
            
            {/* Security Section */}
            <SecuritySection />
            
            {/* Transactions Section */}
            <TransactionSection />
          </div>
        </Container>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
