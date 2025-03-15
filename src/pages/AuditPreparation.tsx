
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuditPreparationDashboard from "@/components/audit/AuditPreparationDashboard";
import { Download, FileCheck, Upload, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AuditPreparation = () => {
  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Comprehensive Audit Preparation</h1>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Documents
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <FileCheck className="h-4 w-4 mr-2" />
                  <span>Export Compliance Report</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileCheck className="h-4 w-4 mr-2" />
                  <span>Export Documentation List</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileCheck className="h-4 w-4 mr-2" />
                  <span>Export Audit Preparation Guide</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              Start Compliance Check
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Document Manager</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Check</TabsTrigger>
            <TabsTrigger value="audit-prep">Audit Defense</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <AuditPreparationDashboard />
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Document management tools are being configured. Please check back soon.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="compliance">
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Compliance check tools are being configured. Please check back soon.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="audit-prep">
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Audit defense tools are being configured. Please check back soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default AuditPreparation;
