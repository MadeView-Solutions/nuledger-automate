
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "@/components/ui/Container";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BusinessAdvisoryDashboard from "@/components/advisory/BusinessAdvisoryDashboard";
import { ArrowUpRight, Download, FileSpreadsheet, UserRound, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BusinessAdvisory = () => {
  return (
    <DashboardLayout>
      <Container className="p-6 max-w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Strategic Business Advisory</h1>
          <div className="flex space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Reports
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  <span>Cash Flow Analysis</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  <span>Growth Strategy Report</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  <span>Risk Assessment</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Request Advisor Consult
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">Strategic Overview</TabsTrigger>
            <TabsTrigger value="opportunities">Growth Opportunities</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <BusinessAdvisoryDashboard />
          </TabsContent>
          
          <TabsContent value="opportunities">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Opportunities</CardTitle>
                  <CardDescription>AI-identified areas for strategic expansion and revenue growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-20 text-muted-foreground">
                    Growth opportunity analysis is being generated. Please check back soon.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Market Analysis</CardTitle>
                  <CardDescription>Competitive landscape and potential market opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-20 text-muted-foreground">
                    Market analysis is being generated. Please check back soon.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="risk">
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Risk management analysis is being generated. Please check back soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default BusinessAdvisory;
