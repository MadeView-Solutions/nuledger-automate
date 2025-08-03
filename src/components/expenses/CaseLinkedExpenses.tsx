import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Receipt, Link2, Search } from "lucide-react";
import { Expense, ExpenseCategory } from "@/types/expense";
import { formatCurrency, formatDate } from "@/utils/formatters";

const CaseLinkedExpenses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCase, setSelectedCase] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Mock data
  const expenses: Expense[] = [
    {
      id: "1",
      amount: 450.00,
      description: "Expert witness consultation",
      category: { id: "1", name: "Expert Witnesses", type: "case-specific", recoverable: true },
      type: "case-specific",
      caseId: "C001",
      caseName: "Smith vs. ABC Corp",
      date: "2024-01-15",
      vendor: "Dr. Medical Expert",
      status: "approved"
    },
    {
      id: "2", 
      amount: 1200.00,
      description: "Office rent allocation",
      category: { id: "2", name: "Office Overhead", type: "operating", recoverable: false },
      type: "operating",
      date: "2024-01-01",
      vendor: "Property Management Co",
      status: "approved"
    },
    {
      id: "3",
      amount: 89.50,
      description: "Court filing fees",
      category: { id: "3", name: "Court Costs", type: "case-specific", recoverable: true },
      type: "case-specific",
      caseId: "C002",
      caseName: "Jones vs. XYZ Inc",
      date: "2024-01-20",
      vendor: "Superior Court",
      status: "reimbursed"
    }
  ];

  const cases = [
    { id: "C001", name: "Smith vs. ABC Corp" },
    { id: "C002", name: "Jones vs. XYZ Inc" },
    { id: "C003", name: "Brown vs. DEF LLC" }
  ];

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCase = selectedCase === "all" || expense.caseId === selectedCase;
    const matchesType = selectedType === "all" || expense.type === selectedType;
    
    return matchesSearch && matchesCase && matchesType;
  });

  const caseSpecificTotal = expenses
    .filter(e => e.type === "case-specific")
    .reduce((sum, e) => sum + e.amount, 0);

  const operatingTotal = expenses
    .filter(e => e.type === "operating")
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Case-Linked Expenses</h2>
          <p className="text-muted-foreground">
            Track and categorize expenses by case for cost recovery
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Expense description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operating">Operating Expense</SelectItem>
                    <SelectItem value="case-specific">Case-Specific</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="case">Link to Case (Optional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case" />
                  </SelectTrigger>
                  <SelectContent>
                    {cases.map(case_ => (
                      <SelectItem key={case_.id} value={case_.id}>
                        {case_.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Add Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Case-Specific Expenses</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(caseSpecificTotal)}</div>
            <p className="text-xs text-muted-foreground">
              Recoverable from clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operating Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(operatingTotal)}</div>
            <p className="text-xs text-muted-foreground">
              Firm overhead costs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(caseSpecificTotal + operatingTotal)}</div>
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
              <CardTitle>Expense Tracker</CardTitle>
              <CardDescription>
                All expenses with case linkage and categorization
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>
              <Select value={selectedCase} onValueChange={setSelectedCase}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cases</SelectItem>
                  {cases.map(case_ => (
                    <SelectItem key={case_.id} value={case_.id}>
                      {case_.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="operating">Operating</SelectItem>
                  <SelectItem value="case-specific">Case-Specific</SelectItem>
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
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{expense.description}</div>
                      {expense.vendor && (
                        <div className="text-sm text-muted-foreground">{expense.vendor}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={expense.type === "case-specific" ? "default" : "secondary"}>
                      {expense.type === "case-specific" ? "Case" : "Operating"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {expense.caseId ? (
                      <div className="flex items-center gap-1">
                        <Link2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{expense.caseName}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        expense.status === "approved" ? "default" :
                        expense.status === "reimbursed" ? "secondary" : "outline"
                      }
                    >
                      {expense.status}
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

export default CaseLinkedExpenses;