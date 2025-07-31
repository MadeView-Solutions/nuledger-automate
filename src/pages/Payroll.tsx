
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PayrollAutomation from "@/components/payroll/PayrollAutomation";

const Payroll = () => {
  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Payroll Management</h1>
          <div className="flex space-x-3">
            <Button variant="outline">Download Reports</Button>
            <Button>Process Payroll</Button>
          </div>
        </div>

        <div className="space-y-8 mb-8">
          <PayrollAutomation />
        </div>

        <Tabs defaultValue="employees" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="history">Payroll History</TabsTrigger>
            <TabsTrigger value="tax">Tax Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees">
            <div className="text-center py-16">
              <p className="text-muted-foreground">Employee data will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="text-center py-16">
              <p className="text-muted-foreground">Payroll history will appear here</p>
            </div>
          </TabsContent>
          
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default Payroll;
