
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
import { Badge } from "@/components/ui/badge";
import { Dices, Upload, Download, Search, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock transaction data
const transactions = [
  {
    id: "TX789012",
    date: "2023-06-10",
    description: "Office Supplies - Amazon",
    category: "Office Expenses",
    amount: 156.78,
    status: "ai-categorized",
    confidence: 0.92,
  },
  {
    id: "TX789013",
    date: "2023-06-09",
    description: "Client Meeting - Coffee Shop",
    category: "Meals & Entertainment",
    amount: 32.50,
    status: "ai-categorized",
    confidence: 0.88,
  },
  {
    id: "TX789014",
    date: "2023-06-08",
    description: "Cloud Services - AWS",
    category: "Software & IT",
    amount: 329.99,
    status: "manual",
    confidence: 1.0,
  },
  {
    id: "TX789015",
    date: "2023-06-07",
    description: "Transportation - Uber",
    category: "Travel",
    amount: 24.50,
    status: "ai-categorized",
    confidence: 0.95,
  },
  {
    id: "TX789016",
    date: "2023-06-06",
    description: "Unidentified Payment",
    category: "Uncategorized",
    amount: 87.65,
    status: "pending",
    confidence: 0.42,
  },
];

const categories = [
  "Advertising & Marketing",
  "Bank Fees",
  "Insurance",
  "Interest Paid",
  "Legal & Professional Services",
  "Meals & Entertainment",
  "Office Expenses",
  "Rent & Lease",
  "Repairs & Maintenance",
  "Software & IT",
  "Taxes & Licenses",
  "Travel",
  "Utilities",
  "Wages & Salaries",
  "Uncategorized",
];

const TransactionManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const handleRunAI = () => {
    toast({
      title: "AI Processing Started",
      description: "AI is analyzing and categorizing your transactions. This may take a few moments.",
      duration: 5000,
    });
    // In a real app, this would call an API to trigger AI processing
  };

  const handleImport = () => {
    toast({
      title: "Import Successful",
      description: "Your transactions have been imported and are being processed.",
      duration: 3000,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Completed",
      description: "Your transactions have been exported successfully.",
      duration: 3000,
    });
  };

  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Transaction Management</CardTitle>
        <CardDescription>
          AI-powered transaction categorization and management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="default" size="sm" onClick={handleRunAI}>
                <Dices className="mr-2 h-4 w-4" />
                Run AI
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
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
                      <select 
                        defaultValue={transaction.category}
                        className="min-w-32 border border-input bg-background text-sm rounded-md px-3 py-1"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="text-right">
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          transaction.status === "ai-categorized" 
                            ? "default" 
                            : transaction.status === "manual" 
                            ? "outline" 
                            : "secondary"
                        }
                      >
                        {transaction.status === "ai-categorized" && `AI (${Math.round(transaction.confidence * 100)}%)`}
                        {transaction.status === "manual" && "Manual"}
                        {transaction.status === "pending" && "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
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
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      </CardFooter>
    </Card>
  );
};

export default TransactionManager;
