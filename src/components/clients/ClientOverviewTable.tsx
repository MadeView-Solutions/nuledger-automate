import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { mockClients } from "@/data/mockClients";

interface FilterState {
  search: string;
  caseManager: string;
  status: string;
  signedRelease: string;
}

const ClientOverviewTable = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    caseManager: "",
    status: "",
    signedRelease: "",
  });

  // Get unique values for filter dropdowns
  const uniqueCaseManagers = useMemo(() => {
    const managers = mockClients
      .map(client => client.caseInfo?.caseManager)
      .filter(Boolean);
    return Array.from(new Set(managers));
  }, []);

  const uniqueStatuses = useMemo(() => {
    const statuses = mockClients.map(client => client.status);
    return Array.from(new Set(statuses));
  }, []);

  // Filter clients based on current filters
  const filteredClients = useMemo(() => {
    return mockClients.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        client.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCaseManager = 
        !filters.caseManager || client.caseInfo?.caseManager === filters.caseManager;
      
      const matchesStatus = 
        !filters.status || client.status === filters.status;
      
      const matchesSignedRelease = 
        !filters.signedRelease || 
        (filters.signedRelease === "yes" && client.status === "settled") ||
        (filters.signedRelease === "no" && client.status !== "settled");

      return matchesSearch && matchesCaseManager && matchesStatus && matchesSignedRelease;
    });
  }, [filters]);

  const calculateAttorneyFee = (settlementAmount?: number) => {
    if (!settlementAmount) return 0;
    return settlementAmount * 0.33; // 33% attorney fee
  };

  const calculatePercentage = (settlementAmount?: number, policyLimit?: number) => {
    if (!settlementAmount || !policyLimit) return 0;
    return Math.round((settlementAmount / policyLimit) * 100);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      pending: "secondary",
      settled: "default",
      closed: "outline",
      inactive: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9"
              />
            </div>
            
            <Select
              value={filters.caseManager}
              onValueChange={(value) => setFilters({ ...filters, caseManager: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Case Manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Managers</SelectItem>
                {uniqueCaseManagers.map((manager) => (
                  <SelectItem key={manager} value={manager!}>{manager}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.signedRelease}
              onValueChange={(value) => setFilters({ ...filters, signedRelease: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Signed Release" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              Showing {filteredClients.length} of {mockClients.length} clients
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Case Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Date Signed</TableHead>
                  <TableHead>Date Settled</TableHead>
                  <TableHead>Case Manager</TableHead>
                  <TableHead>Attorney Fee %</TableHead>
                  <TableHead>Settlement Amount</TableHead>
                  <TableHead>Attorney Fees</TableHead>
                  <TableHead>Policy Limit %</TableHead>
                  <TableHead>Total Paid to Providers</TableHead>
                  <TableHead>Provider Paid?</TableHead>
                  <TableHead>Total Paid to Clients</TableHead>
                  <TableHead>Client Paid?</TableHead>
                  <TableHead>Total Case Expenses</TableHead>
                  <TableHead>Check Received</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Signed Release?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => {
                  const attorneyFee = calculateAttorneyFee(client.caseInfo?.settlementAmount);
                  const policyPercentage = calculatePercentage(client.caseInfo?.settlementAmount, 100000); // Assuming $100k policy limit
                  const totalPaidToProviders = (client.caseInfo?.settlementAmount || 0) * 0.15; // 15% to providers
                  const totalPaidToClients = (client.caseInfo?.settlementAmount || 0) - attorneyFee - totalPaidToProviders;
                  const caseExpenses = (client.caseInfo?.settlementAmount || 0) * 0.05; // 5% expenses

                  return (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.dateAdded ? formatDate(client.dateAdded) : "-"}</TableCell>
                      <TableCell>{client.caseInfo?.dateSettled ? formatDate(client.caseInfo.dateSettled) : "-"}</TableCell>
                      <TableCell>{client.caseInfo?.caseManager || "-"}</TableCell>
                      <TableCell>33%</TableCell>
                      <TableCell>{client.caseInfo?.settlementAmount ? formatCurrency(client.caseInfo.settlementAmount) : "-"}</TableCell>
                      <TableCell>{formatCurrency(attorneyFee)}</TableCell>
                      <TableCell>{policyPercentage}%</TableCell>
                      <TableCell>{formatCurrency(totalPaidToProviders)}</TableCell>
                      <TableCell>
                        <Badge variant={client.status === "settled" ? "default" : "secondary"}>
                          {client.status === "settled" ? "YES" : "NO"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(totalPaidToClients)}</TableCell>
                      <TableCell>
                        <Badge variant={client.status === "settled" ? "default" : "secondary"}>
                          {client.status === "settled" ? "YES" : "NO"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(caseExpenses)}</TableCell>
                      <TableCell>
                        <Badge variant={client.status === "settled" ? "default" : "secondary"}>
                          {client.status === "settled" ? "YES" : "NO"}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.caseInfo?.dateSettled ? formatDate(client.caseInfo.dateSettled) : "-"}</TableCell>
                      <TableCell>{client.caseInfo?.dateSettled ? formatDate(client.caseInfo.dateSettled) : "-"}</TableCell>
                      <TableCell>
                        <Badge variant={client.status === "settled" ? "default" : "destructive"}>
                          {client.status === "settled" ? "YES" : "NO"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientOverviewTable;