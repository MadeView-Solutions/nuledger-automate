
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { TrendingUp, Download, FileSpreadsheet, Calendar } from "lucide-react";

const Reports = () => {
  const { toast } = useToast();
  
  const handleGenerateForm = (formId: string) => {
    toast({
      title: "Generating Form",
      description: `AI is now auto-filling ${formId} with your financial data`,
    });
  };
  
  const handleFileForm = (formId: string) => {
    toast({
      title: "Form Filed Successfully",
      description: `${formId} has been electronically filed with the appropriate agency`,
    });
  };

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Report Downloaded",
      description: `${reportType} report has been downloaded successfully`,
    });
  };

  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Financial Reports</h1>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => handleDownloadReport("All Reports")}>
              <Download className="h-4 w-4 mr-2" />
              Export All Reports
            </Button>
            <Button onClick={() => handleDownloadReport("Custom Report")}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Generate Custom Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="financial" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="financial">Financial Statements</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="financial">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReportCard 
                title="Income Statement" 
                description="Monthly income statement showing revenue, expenses and profit"
                icon={TrendingUp}
                lastUpdated="Yesterday"
              />
              <ReportCard 
                title="Balance Sheet" 
                description="Current assets, liabilities and equity position"
                icon={FileSpreadsheet}
                lastUpdated="2 days ago"
              />
              <ReportCard 
                title="Cash Flow Statement" 
                description="Detail of cash movements across operations, investments, and financing"
                icon={TrendingUp}
                lastUpdated="3 days ago"
              />
              <ReportCard 
                title="Accounts Receivable Aging" 
                description="Analysis of outstanding customer invoices by age"
                icon={Calendar}
                lastUpdated="1 week ago"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="compliance">
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Compliance reports are being generated. Please check back later.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="forecasting">
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Forecasting reports are being generated. Please check back later.</p>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  lastUpdated: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, icon: Icon, lastUpdated }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-muted-foreground">Last updated: {lastUpdated}</span>
          <Button variant="outline" size="sm">
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reports;
