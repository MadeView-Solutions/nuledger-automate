import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Award, TrendingUp, Clock, DollarSign, Target, Calendar } from "lucide-react";
import { NegotiatorPerformance } from "@/types/expense";
import { formatCurrency } from "@/utils/formatters";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const NegotiatorDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedNegotiator, setSelectedNegotiator] = useState("all");

  // Mock data
  const negotiators: NegotiatorPerformance[] = [
    {
      negotiatorId: "N001",
      negotiatorName: "Sarah Johnson",
      totalSettlements: 24,
      totalValue: 2450000,
      averageTimeToSettle: 35,
      averageSettlementValue: 102083,
      feeRecoveryRatio: 0.87,
      monthlyVolume: 8
    },
    {
      negotiatorId: "N002", 
      negotiatorName: "Michael Chen",
      totalSettlements: 18,
      totalValue: 1890000,
      averageTimeToSettle: 42,
      averageSettlementValue: 105000,
      feeRecoveryRatio: 0.82,
      monthlyVolume: 6
    },
    {
      negotiatorId: "N003",
      negotiatorName: "David Wilson",
      totalSettlements: 21,
      totalValue: 2100000,
      averageTimeToSettle: 38,
      averageSettlementValue: 100000,
      feeRecoveryRatio: 0.85,
      monthlyVolume: 7
    }
  ];

  const monthlyData = [
    { month: "Jan", settlements: 15, value: 1250000 },
    { month: "Feb", settlements: 18, value: 1450000 },
    { month: "Mar", settlements: 22, value: 1680000 },
    { month: "Apr", settlements: 19, value: 1520000 },
    { month: "May", settlements: 25, value: 1890000 },
    { month: "Jun", settlements: 23, value: 1750000 }
  ];

  const topPerformer = negotiators.reduce((top, current) => 
    current.totalValue > top.totalValue ? current : top
  );

  const totalVolume = negotiators.reduce((sum, n) => sum + n.totalValue, 0);
  const totalSettlements = negotiators.reduce((sum, n) => sum + n.totalSettlements, 0);
  const avgTimeToSettle = negotiators.reduce((sum, n) => sum + n.averageTimeToSettle, 0) / negotiators.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Negotiator Performance Dashboard</h2>
          <p className="text-muted-foreground">
            Settlement volume, value, and efficiency metrics by negotiator
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalVolume)}</div>
            <p className="text-xs text-muted-foreground">
              {totalSettlements} settlements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time to Settle</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgTimeToSettle)}</div>
            <p className="text-xs text-muted-foreground">
              Days average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topPerformer.negotiatorName}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(topPerformer.totalValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Average across team
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Settlement Volume Trend</CardTitle>
            <CardDescription>Monthly settlement values</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settlement Count by Month</CardTitle>
            <CardDescription>Number of settlements completed</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="settlements" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Negotiator Performance Metrics</CardTitle>
          <CardDescription>
            Individual performance breakdown and key metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Negotiator</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Settlements</TableHead>
                <TableHead>Avg Value</TableHead>
                <TableHead>Avg Time</TableHead>
                <TableHead>Recovery Rate</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {negotiators.map((negotiator) => (
                <TableRow key={negotiator.negotiatorId}>
                  <TableCell>
                    <div className="font-medium">{negotiator.negotiatorName}</div>
                    <div className="text-sm text-muted-foreground">
                      {negotiator.monthlyVolume} per month
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(negotiator.totalValue)}
                  </TableCell>
                  <TableCell>{negotiator.totalSettlements}</TableCell>
                  <TableCell>{formatCurrency(negotiator.averageSettlementValue)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{negotiator.averageTimeToSettle} days</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={negotiator.feeRecoveryRatio > 0.85 ? "default" : "secondary"}>
                      {(negotiator.feeRecoveryRatio * 100).toFixed(0)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-[60px]">
                      <Progress 
                        value={negotiator.feeRecoveryRatio * 100} 
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default NegotiatorDashboard;