
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

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <Container className="max-w-full">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="flex space-x-3">
              <Button variant="outline">Export</Button>
              <Button>New Transaction</Button>
            </div>
          </div>

          <div className="space-y-8">
            <Overview />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Stats />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FraudDetection />
              <FinanceChatbot />
            </div>

            <SecurityMeasures />

            <TransactionsList />
          </div>
        </Container>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
