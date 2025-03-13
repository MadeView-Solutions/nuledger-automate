
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Sparkles, Search, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/utils/formatters";

// Mock transactions to reconcile
const transactionsToReconcile = [
  {
    id: "TX001",
    date: "2023-06-10",
    description: "Office Supplies - Amazon",
    amount: 156.78,
    account: "Business Checking",
    category: "Office Expenses",
    status: "unmatched",
    confidence: null,
    matchedWith: null
  },
  {
    id: "TX002",
    date: "2023-06-09",
    description: "Monthly Subscription - Adobe",
    amount: 52.99,
    account: "Corporate Card",
    category: "Software",
    status: "matched",
    confidence: 0.98,
    matchedWith: "QB78901"
  },
  {
    id: "TX003",
    date: "2023-06-08",
    description: "Client Payment - XYZ Corp",
    amount: 2450.00,
    account: "Business Checking",
    category: "Income",
    status: "matched",
    confidence: 0.95,
    matchedWith: "QB78902"
  },
  {
    id: "TX004",
    date: "2023-06-07",
    description: "Uber Ride",
    amount: 24.50,
    account: "Corporate Card",
    category: "Travel",
    status: "unmatched",
    confidence: null,
    matchedWith: null
  },
  {
    id: "TX005",
    date: "2023-06-06",
    description: "Unknown Transaction",
    amount: 87.65,
    account: "Business Checking",
    category: "Uncategorized",
    status: "flagged",
    confidence: 0.42,
    matchedWith: null
  },
];

const ReconciliationPanel = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [accountFilter, setAccountFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleRunAI = () => {
    toast({
      title: "AI Reconciliation Started",
      description: "Our AI is analyzing and matching your transactions. This may take a few moments.",
      duration: 5000,
    });
  };

  // Apply filters
  const filteredTransactions = transactionsToReconcile.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAccount = accountFilter === "all" || transaction.account === accountFilter;
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    return matchesSearch && matchesAccount && matchesStatus;
  });

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Reconcile Transactions</CardTitle>
            <CardDescription>
              AI-powered transaction matching and reconciliation
            </CardDescription>
          </div>
          <Button variant="default" size="sm" onClick={handleRunAI}>
            <Sparkles className="mr-2 h-4 w-4" />
            Auto-Reconcile with AI
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Filter:</span>
              </div>
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Accounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  <SelectItem value="Business Checking">Business Checking</SelectItem>
                  <SelectItem value="Corporate Card">Corporate Card</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="matched">Matched</SelectItem>
                  <SelectItem value="unmatched">Unmatched</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{transaction.description}</div>
                        <div className="text-xs text-muted-foreground">{transaction.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.account}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          transaction.status === "matched" 
                            ? "default" 
                            : transaction.status === "flagged" 
                            ? "destructive" 
                            : "secondary"
                        }
                        className="flex items-center gap-1"
                      >
                        {transaction.status === "matched" && (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Matched ({Math.round((transaction.confidence || 0) * 100)}%)</span>
                          </>
                        )}
                        {transaction.status === "unmatched" && "Unmatched"}
                        {transaction.status === "flagged" && (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            <span>Flagged</span>
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          {transaction.status === "matched" ? "View Match" : "Find Match"}
                        </Button>
                        {transaction.status === "flagged" && (
                          <Button variant="destructive" size="sm">
                            Resolve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="text-sm text-muted-foreground">
          Showing {filteredTransactions.length} of {transactionsToReconcile.length} transactions
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReconciliationPanel;
