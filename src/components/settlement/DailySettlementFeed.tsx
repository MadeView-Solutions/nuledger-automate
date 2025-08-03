import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, TrendingUp, Users, DollarSign, Clock, Search } from "lucide-react";
import { Settlement } from "@/types/expense";
import { formatCurrency, formatDate } from "@/utils/formatters";

const DailySettlementFeed = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedNegotiator, setSelectedNegotiator] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const settlements: Settlement[] = [
    {
      id: "1",
      caseId: "C001",
      caseName: "Smith vs. ABC Corp",
      amount: 125000,
      date: "2024-01-25",
      negotiatorId: "N001",
      negotiatorName: "Sarah Johnson",
      status: "approved",
      timeToSettle: 45,
      feeAmount: 41250,
      recoveryRatio: 0.85
    },
    {
      id: "2",
      caseId: "C002", 
      caseName: "Jones vs. XYZ Inc",
      amount: 85000,
      date: "2024-01-25",
      negotiatorId: "N002",
      negotiatorName: "Michael Chen",
      status: "pending",
      timeToSettle: 32,
      feeAmount: 28050,
      recoveryRatio: 0.92
    },
    {
      id: "3",
      caseId: "C003",
      caseName: "Brown vs. DEF LLC",
      amount: 67500,
      date: "2024-01-24",
      negotiatorId: "N001",
      negotiatorName: "Sarah Johnson",
      status: "disbursed",
      timeToSettle: 28,
      feeAmount: 22275,
      recoveryRatio: 0.78
    }
  ];

  const negotiators = [
    { id: "N001", name: "Sarah Johnson" },
    { id: "N002", name: "Michael Chen" },
    { id: "N003", name: "David Wilson" }
  ];

  const filteredSettlements = settlements.filter(settlement => {
    const matchesSearch = settlement.caseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         settlement.negotiatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNegotiator = selectedNegotiator === "all" || settlement.negotiatorId === selectedNegotiator;
    
    return matchesSearch && matchesNegotiator;
  });

  const todaySettlements = settlements.filter(s => s.date === selectedDate);
  const todayTotal = todaySettlements.reduce((sum, s) => sum + s.amount, 0);
  const todayCount = todaySettlements.length;
  const avgTimeToSettle = todaySettlements.length > 0 
    ? todaySettlements.reduce((sum, s) => sum + (s.timeToSettle || 0), 0) / todaySettlements.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Daily Settlement Feed</h2>
          <p className="text-muted-foreground">
            Real-time tracker of settlements by date and negotiator
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-[150px]"
          />
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Settlements</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(todayTotal)}</div>
            <p className="text-xs text-muted-foreground">
              {todayCount} settlements completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgTimeToSettle)}</div>
            <p className="text-xs text-muted-foreground">
              Days to settle
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Negotiators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(todaySettlements.map(s => s.negotiatorId)).size}</div>
            <p className="text-xs text-muted-foreground">
              Working today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Settlement Activity</CardTitle>
              <CardDescription>
                Track settlement progress and negotiator performance
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search settlements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>
              <Select value={selectedNegotiator} onValueChange={setSelectedNegotiator}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Negotiators</SelectItem>
                  {negotiators.map(neg => (
                    <SelectItem key={neg.id} value={neg.id}>
                      {neg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Settlement Amount</TableHead>
                <TableHead>Negotiator</TableHead>
                <TableHead>Time to Settle</TableHead>
                <TableHead>Recovery Ratio</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSettlements.map((settlement) => (
                <TableRow key={settlement.id}>
                  <TableCell>{formatDate(settlement.date)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{settlement.caseName}</div>
                      <div className="text-sm text-muted-foreground">{settlement.caseId}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(settlement.amount)}</TableCell>
                  <TableCell>{settlement.negotiatorName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{settlement.timeToSettle} days</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={settlement.recoveryRatio && settlement.recoveryRatio > 0.8 ? "default" : "secondary"}>
                      {settlement.recoveryRatio ? `${(settlement.recoveryRatio * 100).toFixed(0)}%` : "—"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        settlement.status === "disbursed" ? "default" :
                        settlement.status === "approved" ? "secondary" : "outline"
                      }
                    >
                      {settlement.status}
                    </Badge>
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

export default DailySettlementFeed;