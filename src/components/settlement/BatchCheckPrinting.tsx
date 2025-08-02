import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Download, FileText, CheckCircle, Clock } from "lucide-react";

interface CheckPayment {
  id: string;
  payeeType: 'client' | 'vendor' | 'lien_holder';
  payeeName: string;
  caseId: string;
  amount: number;
  description: string;
  status: 'pending' | 'printed' | 'mailed' | 'cleared';
  checkNumber?: string;
  printedDate?: string;
  selected?: boolean;
}

const BatchCheckPrinting = () => {
  const [selectedBank, setSelectedBank] = useState("");
  const [startingCheckNumber, setStartingCheckNumber] = useState("1001");
  
  // Mock data for demonstration
  const [checkPayments, setCheckPayments] = useState<CheckPayment[]>([
    {
      id: "CP001",
      payeeType: "client",
      payeeName: "John Smith",
      caseId: "CASE001",
      amount: 95000,
      description: "Settlement net payment",
      status: "pending",
      selected: true
    },
    {
      id: "CP002",
      payeeType: "vendor",
      payeeName: "Dr. Michael Johnson",
      caseId: "CASE001",
      amount: 5000,
      description: "Expert witness fee",
      status: "pending",
      selected: true
    },
    {
      id: "CP003",
      payeeType: "lien_holder",
      payeeName: "City Hospital",
      caseId: "CASE001",
      amount: 18000,
      description: "Medical lien settlement",
      status: "pending",
      selected: false
    },
    {
      id: "CP004",
      payeeType: "client",
      payeeName: "Jane Doe",
      caseId: "CASE002",
      amount: 285000,
      description: "Settlement net payment",
      status: "printed",
      checkNumber: "1000",
      printedDate: "2024-07-22"
    }
  ]);

  const handleSelectAll = (checked: boolean) => {
    setCheckPayments(payments => 
      payments.map(payment => ({
        ...payment,
        selected: payment.status === 'pending' ? checked : payment.selected
      }))
    );
  };

  const handleSelectPayment = (id: string, checked: boolean) => {
    setCheckPayments(payments =>
      payments.map(payment =>
        payment.id === id ? { ...payment, selected: checked } : payment
      )
    );
  };

  const selectedCount = checkPayments.filter(p => p.selected && p.status === 'pending').length;
  const totalAmount = checkPayments
    .filter(p => p.selected && p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const getPayeeIcon = (type: string) => {
    switch (type) {
      case 'client': return '👤';
      case 'vendor': return '👨‍💼';
      case 'lien_holder': return '🏥';
      default: return '📋';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'printed': return <Printer className="w-4 h-4 text-blue-500" />;
      case 'mailed': return <FileText className="w-4 h-4 text-purple-500" />;
      case 'cleared': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'printed': return 'outline';
      case 'mailed': return 'default';
      case 'cleared': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Batch Print Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="w-5 h-5" />
            Batch Check Printing
          </CardTitle>
          <CardDescription>
            Generate checks for vendors and clients from approved settlements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankAccount">Bank Account</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operating">Operating Account - *1234</SelectItem>
                  <SelectItem value="trust">Trust Account - *5678</SelectItem>
                  <SelectItem value="client">Client Funds - *9012</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startingCheck">Starting Check Number</Label>
              <Input
                id="startingCheck"
                value={startingCheckNumber}
                onChange={(e) => setStartingCheckNumber(e.target.value)}
                placeholder="1001"
              />
            </div>
          </div>
          
          {selectedCount > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ready to Print</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCount} checks totaling ${totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button>
                    <Printer className="w-4 h-4 mr-2" />
                    Print Checks
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payments Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Payments Queue</CardTitle>
          <CardDescription>
            Select payments to include in batch check printing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={checkPayments.filter(p => p.status === 'pending').every(p => p.selected)}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>Case ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check #</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Checkbox
                      checked={payment.selected || false}
                      onCheckedChange={(checked) => handleSelectPayment(payment.id, checked as boolean)}
                      disabled={payment.status !== 'pending'}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{getPayeeIcon(payment.payeeType)}</span>
                      <div>
                        <div className="font-medium">{payment.payeeName}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {payment.payeeType.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{payment.caseId}</TableCell>
                  <TableCell className="font-medium">
                    ${payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <Badge variant={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{payment.checkNumber || '-'}</TableCell>
                  <TableCell>{payment.printedDate || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Print History & Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Check Printing Reports</CardTitle>
          <CardDescription>
            Download reports and reconciliation files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">24</div>
                <p className="text-sm text-muted-foreground">Checks Printed This Month</p>
                <Button variant="outline" className="w-full mt-3" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export List
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">$485,000</div>
                <p className="text-sm text-muted-foreground">Total Amount Disbursed</p>
                <Button variant="outline" className="w-full mt-3" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Summary
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">3</div>
                <p className="text-sm text-muted-foreground">Pending Clearance</p>
                <Button variant="outline" className="w-full mt-3" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Bank Reconciliation
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchCheckPrinting;