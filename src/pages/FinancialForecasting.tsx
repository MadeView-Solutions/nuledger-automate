
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ForecastStats from "@/components/forecasting/ForecastStats";
import CashFlowForecast from "@/components/forecasting/CashFlowForecast";
import BudgetRecommendations from "@/components/forecasting/BudgetRecommendations";

const FinancialForecasting = () => {
  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Financial Forecasting & AI Analytics</h1>
          <div className="flex space-x-3">
            <Button variant="outline">Export Data</Button>
            <Button>Generate New Forecast</Button>
          </div>
        </div>

        <Tabs defaultValue="cashflow" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="cashflow">Cash Flow Forecasting</TabsTrigger>
            <TabsTrigger value="budget">Budget Recommendations</TabsTrigger>
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cashflow">
            <ForecastStats />
            <CashFlowForecast />
          </TabsContent>
          
          <TabsContent value="budget">
            <BudgetRecommendations />
          </TabsContent>
          
          <TabsContent value="reports">
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Financial reports are being generated. Please check back later.</p>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default FinancialForecasting;
