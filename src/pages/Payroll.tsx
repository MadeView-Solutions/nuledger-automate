
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PayrollAutomation from "@/components/payroll/PayrollAutomation";
import { Plus, Download, FileText } from "lucide-react";

const Payroll = () => {
  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Payroll & HR Automation</h1>
          <div className="flex space-x-3">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Run Payroll
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="tax">Tax & Compliance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-8">
              <PayrollAutomation />
              <div className="bg-muted/30 p-6 rounded-lg border text-center">
                <h3 className="text-lg font-medium mb-2">Advanced Payroll Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  AI-powered insights into payroll trends, labor costs, and compliance risks.
                </p>
                <Button>
                  Generate Payroll Analysis
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="employees">
            <div className="h-96 flex items-center justify-center border rounded-lg">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">Employee Management</h3>
                <p className="text-muted-foreground mb-4">
                  Manage employees, their benefits, tax information, and salary details.
                </p>
                <Button>Add Employee</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tax">
            <div className="h-96 flex items-center justify-center border rounded-lg">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">Tax & Compliance Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Manage tax filings, view compliance status, and ensure legal requirements are met.
                </p>
                <Button>Generate Tax Forms</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="h-96 flex items-center justify-center border rounded-lg">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">Payroll Settings</h3>
                <p className="text-muted-foreground mb-4">
                  Configure pay periods, approval workflows, and integration preferences.
                </p>
                <Button>Save Settings</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default Payroll;
