
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MigrationOverview from "@/components/migration/MigrationOverview";
import MigrationWizard from "@/components/migration/MigrationWizard";
import MigrationHistory from "@/components/migration/MigrationHistory";
import MigrationSupport from "@/components/migration/MigrationSupport";

const DataMigration = () => {
  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Data Migration Center</h1>
          <div className="flex space-x-3">
            <Button variant="outline">View Documentation</Button>
            <Button>Start New Migration</Button>
          </div>
        </div>

        <div className="mb-8">
          <MigrationOverview />
        </div>

        <Tabs defaultValue="wizard" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="wizard">Migration Wizard</TabsTrigger>
            <TabsTrigger value="templates">Data Templates</TabsTrigger>
            <TabsTrigger value="history">Migration History</TabsTrigger>
            <TabsTrigger value="support">Migration Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wizard">
            <MigrationWizard />
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DataTemplateCard 
                title="Chart of Accounts" 
                description="Template for importing your chart of accounts structure"
                templateType="excel"
              />
              <DataTemplateCard 
                title="Client Data" 
                description="Import client information including contact details and settings"
                templateType="csv"
              />
              <DataTemplateCard 
                title="Historical Transactions" 
                description="Import transaction history with detailed categorization"
                templateType="excel"
              />
              <DataTemplateCard 
                title="Vendor Information" 
                description="Import vendor data including payment details and history"
                templateType="csv"
              />
              <DataTemplateCard 
                title="Employee Records" 
                description="Import employee data for payroll and permissions"
                templateType="excel"
              />
              <DataTemplateCard 
                title="Trust Account Data" 
                description="Import client trust balances and transaction history"
                templateType="excel"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <MigrationHistory />
          </TabsContent>
          
          <TabsContent value="support">
            <MigrationSupport />
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

interface DataTemplateCardProps {
  title: string;
  description: string;
  templateType: 'csv' | 'excel' | 'json';
}

const DataTemplateCard: React.FC<DataTemplateCardProps> = ({ title, description, templateType }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
          {templateType === 'excel' && <FileSpreadsheetIcon className="h-6 w-6 text-green-600" />}
          {templateType === 'csv' && <FileTextIcon className="h-6 w-6 text-blue-600" />}
          {templateType === 'json' && <FileJsonIcon className="h-6 w-6 text-yellow-600" />}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          
          <div className="mt-4 flex space-x-2">
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-3 w-3 mr-1" />
              Download Template
            </Button>
            <Button size="sm">
              <UploadIcon className="h-3 w-3 mr-1" />
              Upload Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icons for template types
const FileSpreadsheetIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h2" />
    <path d="M8 17h2" />
    <path d="M14 13h2" />
    <path d="M14 17h2" />
  </svg>
);

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const FileJsonIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1" />
    <path d="M14 16a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default DataMigration;
