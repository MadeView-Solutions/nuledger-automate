import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Download, Eye } from "lucide-react";
import { ClaimType, CheckRecord } from "@/types/legal";

const CheckLedger = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [claimTypeFilter, setClaimTypeFilter] = useState<ClaimType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data for checks
  const checks: CheckRecord[] = [
    {
      id: "CHK001",
      caseId: "CASE001",
      caseName: "Smith v. ABC Insurance",
      claimType: "3P",
      checkNumber: "12345",
      amount: 25000,
      dateReceived: "2024-07-25",
      status: "received",
      payerName: "ABC Insurance Co.",
      notes: "Settlement check received"
    },
    {
      id: "CHK002", 
      caseId: "CASE002",
      caseName: "Johnson Personal Injury",
      claimType: "PIP",
      amount: 15000,
      dateExpected: "2024-08-05",
      status: "outstanding",
      payerName: "State Farm Insurance",
      notes: "PIP claim pending approval"
    },
    {
      id: "CHK003",
      caseId: "CASE003", 
      caseName: "Williams Medical Bills",
      claimType: "MedPay",
      checkNumber: "67890",
      amount: 8500,
      dateReceived: "2024-07-20",
      status: "deposited",
      payerName: "Allstate Insurance",
      notes: "Medical payments claim"
    },
    {
      id: "CHK004",
      caseId: "CASE004",
      caseName: "Davis v. XYZ Corp",
      claimType: "1P",
      amount: 45000,
      dateExpected: "2024-08-10",
      status: "outstanding", 
      payerName: "Progressive Insurance",
      notes: "First party claim settlement"
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "received": return "default";
      case "outstanding": return "secondary";
      case "deposited": return "outline";
      case "bounced": return "destructive";
      default: return "secondary";
    }
  };

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

  const filteredChecks = checks.filter(check => {
    const matchesSearch = check.caseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.checkNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClaimType = claimTypeFilter === "all" || check.claimType === claimTypeFilter;
    const matchesStatus = statusFilter === "all" || check.status === statusFilter;
    
    return matchesSearch && matchesClaimType && matchesStatus;
  });

  const totalOutstanding = checks
    .filter(c => c.status === "outstanding")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalReceived = checks
    .filter(c => c.status === "received" || c.status === "deposited")
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Check Ledger</h1>
            <p className="text-muted-foreground">
              Track received and outstanding checks by claim type
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Check Record
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Outstanding</CardDescription>
              <CardTitle className="text-2xl text-orange-600">
                ${totalOutstanding.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Received</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                ${totalReceived.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Records</CardDescription>
              <CardTitle className="text-2xl">{checks.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Check Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search cases, payers, or check numbers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={claimTypeFilter} onValueChange={(value) => setClaimTypeFilter(value as ClaimType | "all")}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Claim Type" />
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="outstanding">Outstanding</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="deposited">Deposited</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Name</TableHead>
                  <TableHead>Claim Type</TableHead>
                  <TableHead>Check #</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChecks.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{check.caseName}</div>
                        <div className="text-sm text-muted-foreground">{check.caseId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getClaimTypeBadgeVariant(check.claimType)}>
                        {check.claimType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {check.checkNumber || "—"}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${check.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{check.payerName}</TableCell>
                    <TableCell>
                      {check.dateReceived || check.dateExpected || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(check.status)}>
                        {check.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
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

export default CheckLedger;