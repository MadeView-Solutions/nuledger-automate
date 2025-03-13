
import React from "react";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import Overview from "@/components/dashboard/Overview";
import TransactionsList from "@/components/dashboard/TransactionsList";
import Stats from "@/components/dashboard/Stats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FraudDetection from "@/components/security/FraudDetection";
import FinanceChatbot from "@/components/chatbot/FinanceChatbot";
import SecurityMeasures from "@/components/security/SecurityMeasures";
import IntegrationsSummary from "@/components/integrations/IntegrationsSummary";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, Download } from "lucide-react";

const Dashboard = () => {
  const isMobile = useIsMobile();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <Container className="max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
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
            <Overview />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2">
                <Stats />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <FraudDetection />
              <FinanceChatbot />
            </div>
            
            <IntegrationsSummary />

            <SecurityMeasures />

            <TransactionsList />
          </div>
        </Container>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
