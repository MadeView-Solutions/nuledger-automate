
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { TrendingUp, Download, FileSpreadsheet, Calendar, Users, Clock, Target } from "lucide-react";

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

  // Mock settlement analytics data
  const settlementAnalytics = [
    {
      id: 1,
      negotiator: "Sarah Johnson",
      clientName: "Johnson Family Trust",
      signedDate: "2024-01-15",
      settledDate: "2024-06-20",
      daysToSettle: 156,
      settlementAmount: 250000,
      policyLimits: 300000,
      recoveryPercentage: 83.3,
    },
    {
      id: 2,
      negotiator: "Michael Chen",
      clientName: "ABC Construction Inc.",
      signedDate: "2024-02-01",
      settledDate: "2024-07-15",
      daysToSettle: 165,
      settlementAmount: 185000,
      policyLimits: 250000,
      recoveryPercentage: 74.0,
    },
    {
      id: 3,
      negotiator: "Emily Rodriguez",
      clientName: "Martinez Personal Injury",
      signedDate: "2024-03-10",
      settledDate: "2024-08-05",
      daysToSettle: 148,
      settlementAmount: 425000,
      policyLimits: 500000,
      recoveryPercentage: 85.0,
    },
    {
      id: 4,
      negotiator: "David Thompson",
      clientName: "Thompson vs. State Farm",
      signedDate: "2024-01-20",
      settledDate: "2024-05-30",
      daysToSettle: 131,
      settlementAmount: 125000,
      policyLimits: 100000,
      recoveryPercentage: 125.0,
    },
  ];

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

        <Tabs defaultValue="settlement" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="settlement">Settlement Analytics</TabsTrigger>
            <TabsTrigger value="financial">Financial Statements</TabsTrigger>
            <TabsTrigger value="legal">Legal Reports</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settlement">
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Average Settlement Time</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">150 days</div>
                    <p className="text-xs text-muted-foreground">From signing to settlement</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Average Recovery Rate</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">91.8%</div>
                    <p className="text-xs text-muted-foreground">Of policy limits recovered</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Active Negotiators</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-muted-foreground">Settlement negotiators</p>
                  </CardContent>
                </Card>
              </div>

              {/* Settlement Analytics Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Settlement Performance Analytics</CardTitle>
                  <CardDescription>
                    Detailed breakdown of settlement negotiations and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Negotiator</TableHead>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Days to Settle</TableHead>
                        <TableHead>Settlement Amount</TableHead>
                        <TableHead>Policy Limits</TableHead>
                        <TableHead>Recovery %</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {settlementAnalytics.map((settlement) => (
                        <TableRow key={settlement.id}>
                          <TableCell className="font-medium">{settlement.negotiator}</TableCell>
                          <TableCell>{settlement.clientName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              {settlement.daysToSettle} days
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${settlement.settlementAmount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ${settlement.policyLimits.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className={`font-medium ${
                              settlement.recoveryPercentage >= 100 
                                ? 'text-green-600' 
                                : settlement.recoveryPercentage >= 80 
                                ? 'text-yellow-600' 
                                : 'text-red-600'
                            }`}>
                              {settlement.recoveryPercentage.toFixed(1)}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
          
          <TabsContent value="legal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReportCard 
                title="Settlement Summary by Claim Type" 
                description="Breakdown of settlements by 3P, 1P, PIP, MedPay, and DV claims"
                icon={TrendingUp}
                lastUpdated="Today"
              />
              <ReportCard 
                title="Time-to-Settlement Analysis" 
                description="Average settlement duration analysis by claim type"
                icon={Calendar}
                lastUpdated="Yesterday"
              />
              <ReportCard 
                title="Recovery Timeline Report" 
                description="Analysis of check receipt times after settlement"
                icon={FileSpreadsheet}
                lastUpdated="2 days ago"
              />
              <ReportCard 
                title="Outstanding Checks Report" 
                description="Report of pending check receipts by claim type and payer"
                icon={TrendingUp}
                lastUpdated="Today"
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
