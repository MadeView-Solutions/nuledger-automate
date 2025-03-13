
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
import { Search, Download, FileText, Brain, Send, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock invoices data
const invoices = [
  {
    id: "INV-001",
    client: "Acme Corp",
    amount: 1250.00,
    date: "2023-06-15",
    dueDate: "2023-06-30",
    status: "paid",
    aiGenerated: true,
  },
  {
    id: "INV-002",
    client: "Globex Inc",
    amount: 3450.75,
    date: "2023-06-12",
    dueDate: "2023-06-27",
    status: "pending",
    aiGenerated: true,
  },
  {
    id: "INV-003",
    client: "Stark Industries",
    amount: 7800.50,
    date: "2023-06-10",
    dueDate: "2023-06-25",
    status: "overdue",
    aiGenerated: false,
  },
  {
    id: "INV-004",
    client: "Wayne Enterprises",
    amount: 4500.00,
    date: "2023-06-05",
    dueDate: "2023-06-20",
    status: "paid",
    aiGenerated: true,
  },
  {
    id: "INV-005",
    client: "Oscorp",
    amount: 2100.25,
    date: "2023-06-01",
    dueDate: "2023-06-16",
    status: "pending",
    aiGenerated: false,
  },
];

const InvoiceManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const handleGenerateInvoice = () => {
    toast({
      title: "AI Invoice Generation Started",
      description: "AI is analyzing your data to generate new invoices. This may take a few moments.",
      duration: 5000,
    });
  };

  const handleSendReminders = () => {
    toast({
      title: "Payment Reminders Sent",
      description: "Automated payment reminders have been sent to clients with pending invoices.",
      duration: 3000,
    });
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Invoice Management</CardTitle>
        <CardDescription>
          AI-powered invoice generation, tracking, and reconciliation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleSendReminders}>
                <Bell className="mr-2 h-4 w-4" />
                Send Reminders
              </Button>
              <Button variant="default" size="sm" onClick={handleGenerateInvoice}>
                <Brain className="mr-2 h-4 w-4" />
                Generate AI Invoice
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {invoice.id}
                        {invoice.aiGenerated && (
                          <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-950">
                            <Brain className="h-3 w-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      ${invoice.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <FileText className="h-4 w-4" />
                        </Button>
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
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </div>
      </CardFooter>
    </Card>
  );
};

export default InvoiceManager;
