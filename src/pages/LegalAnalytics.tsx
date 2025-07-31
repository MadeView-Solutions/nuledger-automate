import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Calendar, TrendingUp, Clock, Download } from "lucide-react";
import { ClaimType, TimeAnalytics } from "@/types/legal";

const LegalAnalytics = () => {
  const [timeRange, setTimeRange] = useState("6months");
  const [claimTypeFilter, setClaimTypeFilter] = useState<ClaimType | "all">("all");

  // Mock analytics data
  const timeAnalytics: TimeAnalytics[] = [
    {
      caseId: "CASE001",
      caseName: "Smith v. ABC Insurance",
      claimType: "3P",
      dateOpened: "2024-03-15",
      dateSettled: "2024-06-20",
      dateCheckReceived: "2024-07-25",
      settlementDuration: 97,
      recoveryDuration: 35
    },
    {
      caseId: "CASE002",
      caseName: "Johnson Personal Injury", 
      claimType: "PIP",
      dateOpened: "2024-02-10",
      dateSettled: "2024-05-15",
      dateCheckReceived: "2024-06-01",
      settlementDuration: 95,
      recoveryDuration: 17
    },
    {
      caseId: "CASE003",
      caseName: "Williams Medical Bills",
      claimType: "MedPay",
      dateOpened: "2024-04-01",
      dateSettled: "2024-06-10",
      dateCheckReceived: "2024-07-20",
      settlementDuration: 70,
      recoveryDuration: 40
    },
    {
      caseId: "CASE004",
      caseName: "Davis v. XYZ Corp",
      claimType: "1P", 
      dateOpened: "2024-01-20",
      dateSettled: "2024-05-30",
      settlementDuration: 131,
      recoveryDuration: undefined // Check not received yet
    }
  ];

  // Chart data for settlement duration by claim type
  const settlementDurationData = [
    { claimType: "3P", avgDays: 110, cases: 15 },
    { claimType: "1P", avgDays: 125, cases: 8 },
    { claimType: "PIP", avgDays: 85, cases: 22 },
    { claimType: "MedPay", avgDays: 65, cases: 18 },
    { claimType: "DV", avgDays: 95, cases: 5 }
  ];

  // Chart data for recovery duration
  const recoveryDurationData = [
    { claimType: "3P", avgDays: 28, cases: 12 },
    { claimType: "1P", avgDays: 35, cases: 6 },
    { claimType: "PIP", avgDays: 22, cases: 20 },
    { claimType: "MedPay", avgDays: 30, cases: 16 },
    { claimType: "DV", avgDays: 25, cases: 4 }
  ];

  // Trend data for the last 6 months
  const trendData = [
    { month: "Feb", settlements: 8, avgSettlementDays: 120, avgRecoveryDays: 32 },
    { month: "Mar", settlements: 12, avgSettlementDays: 115, avgRecoveryDays: 28 },
    { month: "Apr", settlements: 15, avgSettlementDays: 108, avgRecoveryDays: 30 },
    { month: "May", settlements: 18, avgSettlementDays: 102, avgRecoveryDays: 26 },
    { month: "Jun", settlements: 22, avgSettlementDays: 98, avgRecoveryDays: 24 },
    { month: "Jul", settlements: 16, avgSettlementDays: 95, avgRecoveryDays: 22 }
  ];

  const getClaimTypeBadgeVariant = (claimType: ClaimType) => {
    switch (claimType) {
      case "3P": return "default";
      case "1P": return "secondary";
      case "PIP": return "outline";
      case "MedPay": return "destructive";
      case "DV": return "secondary";
      default: return "secondary";
    }
  };

  const filteredAnalytics = timeAnalytics.filter(analytics => 
    claimTypeFilter === "all" || analytics.claimType === claimTypeFilter
  );

  const avgSettlementDuration = filteredAnalytics.reduce((sum, a) => sum + (a.settlementDuration || 0), 0) / filteredAnalytics.length;
  const avgRecoveryDuration = filteredAnalytics
    .filter(a => a.recoveryDuration)
    .reduce((sum, a) => sum + (a.recoveryDuration || 0), 0) / filteredAnalytics.filter(a => a.recoveryDuration).length;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Legal Analytics</h1>
            <p className="text-muted-foreground">
              Time-to-settle and time-to-recovery analytics by claim type
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Settlement Duration</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                {Math.round(avgSettlementDuration)} days
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Recovery Duration</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                {Math.round(avgRecoveryDuration)} days
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Cases Analyzed</CardDescription>
              <CardTitle className="text-2xl">{filteredAnalytics.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Recovery Rate</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {Math.round((filteredAnalytics.filter(a => a.recoveryDuration).length / filteredAnalytics.length) * 100)}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settlement Duration Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Average Settlement Duration by Claim Type</CardTitle>
              <CardDescription>Days from case open to settlement</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={settlementDurationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="claimType" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgDays" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recovery Duration Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Average Recovery Duration by Claim Type</CardTitle>
              <CardDescription>Days from settlement to check receipt</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recoveryDurationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="claimType" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgDays" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Settlement & Recovery Trends</CardTitle>
            <CardDescription>Monthly trends in settlement and recovery times</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgSettlementDays" 
                  stroke="hsl(var(--primary))" 
                  name="Avg Settlement Days"
                />
                <Line 
                  type="monotone" 
                  dataKey="avgRecoveryDays" 
                  stroke="hsl(var(--secondary))" 
                  name="Avg Recovery Days"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Analytics Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Case-by-Case Analytics</CardTitle>
                <CardDescription>Detailed timing analysis for individual cases</CardDescription>
              </div>
              <Select value={claimTypeFilter} onValueChange={(value) => setClaimTypeFilter(value as ClaimType | "all")}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="3P">Third Party</SelectItem>
                  <SelectItem value="1P">First Party</SelectItem>
                  <SelectItem value="PIP">PIP</SelectItem>
                  <SelectItem value="MedPay">MedPay</SelectItem>
                  <SelectItem value="DV">DV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Opened</TableHead>
                  <TableHead>Date Settled</TableHead>
                  <TableHead>Settlement Duration</TableHead>
                  <TableHead>Check Received</TableHead>
                  <TableHead>Recovery Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnalytics.map((analytics) => (
                  <TableRow key={analytics.caseId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{analytics.caseName}</div>
                        <div className="text-sm text-muted-foreground">{analytics.caseId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getClaimTypeBadgeVariant(analytics.claimType)}>
                        {analytics.claimType}
                      </Badge>
                    </TableCell>
                    <TableCell>{analytics.dateOpened}</TableCell>
                    <TableCell>{analytics.dateSettled || "—"}</TableCell>
                    <TableCell>
                      {analytics.settlementDuration ? (
                        <span className="font-medium">{analytics.settlementDuration} days</span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{analytics.dateCheckReceived || "—"}</TableCell>
                    <TableCell>
                      {analytics.recoveryDuration ? (
                        <span className="font-medium">{analytics.recoveryDuration} days</span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LegalAnalytics;