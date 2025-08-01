import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, DollarSign, Calendar, AlertTriangle } from "lucide-react";
import { VendorPayable } from "@/types/settlement";
import { Textarea } from "@/components/ui/textarea";

const PayablesTracker = () => {
  const [payables, setPayables] = useState<VendorPayable[]>([
    {
      id: "P001",
      vendorId: "V001",
      caseId: "C001",
      amount: 2500,
      description: "Medical records review",
      invoiceNumber: "INV-2024-001",
      dateIncurred: "2024-07-15",
      dueDate: "2024-08-14",
      status: "pending",
      notes: "Awaiting case settlement"
    },
    {
      id: "P002",
      vendorId: "V002",
      caseId: "C002",
      amount: 5000,
      description: "Expert witness testimony",
      invoiceNumber: "EWS-789",
      dateIncurred: "2024-07-20",
      dueDate: "2024-08-19",
      status: "approved"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<VendorPayable>>({
    vendorId: '',
    caseId: '',
    amount: 0,
    description: '',
    invoiceNumber: '',
    dateIncurred: '',
    dueDate: '',
    status: 'pending',
    notes: ''
  });

  // Mock vendor data for dropdown
  const vendors = [
    { id: "V001", name: "City Medical Center" },
    { id: "V002", name: "Expert Witness Services" },
    { id: "V003", name: "ABC Court Reporting" }
  ];

  // Mock case data for dropdown
  const cases = [
    { id: "C001", name: "Smith vs. Jones" },
    { id: "C002", name: "Johnson vs. City" },
    { id: "C003", name: "Williams vs. Corp" }
  ];

  const handleAddPayable = () => {
    const newPayable: VendorPayable = {
      id: `P${(payables.length + 1).toString().padStart(3, '0')}`,
      vendorId: formData.vendorId || '',
      caseId: formData.caseId || '',
      amount: formData.amount || 0,
      description: formData.description || '',
      invoiceNumber: formData.invoiceNumber,
      dateIncurred: formData.dateIncurred || new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      status: formData.status || 'pending',
      notes: formData.notes
    };
    
    setPayables([...payables, newPayable]);
    setFormData({
      vendorId: '',
      caseId: '',
      amount: 0,
      description: '',
      invoiceNumber: '',
      dateIncurred: '',
      dueDate: '',
      status: 'pending',
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const updatePayableStatus = (id: string, status: VendorPayable['status']) => {
    setPayables(payables.map(p => p.id === id ? { ...p, status } : p));
  };

  const getStatusColor = (status: VendorPayable['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getVendorName = (vendorId: string) => {
    return vendors.find(v => v.id === vendorId)?.name || 'Unknown Vendor';
  };

  const getCaseName = (caseId: string) => {
    return cases.find(c => c.id === caseId)?.name || 'Unknown Case';
  };

  const totalPending = payables
    .filter(p => p.status === 'pending' || p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);

  const overdueCount = payables.filter(p => isOverdue(p.dueDate) && p.status !== 'paid').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-muted-foreground" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Pending</p>
              <p className="text-2xl font-bold">${totalPending.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-muted-foreground" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Payables</p>
              <p className="text-2xl font-bold">{payables.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payables Tracker</CardTitle>
              <CardDescription>
                Track vendor invoices and payment obligations by case
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payable
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Payable</DialogTitle>
                  <DialogDescription>
                    Record a new vendor invoice or payment obligation
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor *</Label>
                    <select
                      id="vendor"
                      className="w-full p-2 border rounded"
                      value={formData.vendorId}
                      onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                    >
                      <option value="">Select vendor</option>
                      {vendors.map(vendor => (
                        <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="case">Case *</Label>
                    <select
                      id="case"
                      className="w-full p-2 border rounded"
                      value={formData.caseId}
                      onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                    >
                      <option value="">Select case</option>
                      {cases.map(caseItem => (
                        <option key={caseItem.id} value={caseItem.id}>{caseItem.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateIncurred">Date Incurred</Label>
                    <Input
                      id="dateIncurred"
                      type="date"
                      value={formData.dateIncurred}
                      onChange={(e) => setFormData({ ...formData, dateIncurred: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPayable}>
                    Add Payable
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payables.map((payable) => (
                <TableRow key={payable.id} className={isOverdue(payable.dueDate) && payable.status !== 'paid' ? 'bg-red-50' : ''}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{getVendorName(payable.vendorId)}</div>
                      {payable.invoiceNumber && (
                        <div className="text-sm text-muted-foreground">
                          {payable.invoiceNumber}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getCaseName(payable.caseId)}</TableCell>
                  <TableCell>{payable.description}</TableCell>
                  <TableCell className="font-medium">${payable.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {payable.dueDate}
                      {isOverdue(payable.dueDate) && payable.status !== 'paid' && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payable.status)}>
                      {payable.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {payable.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updatePayableStatus(payable.id, 'approved')}
                        >
                          Approve
                        </Button>
                      )}
                      {payable.status === 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updatePayableStatus(payable.id, 'paid')}
                        >
                          Mark Paid
                        </Button>
                      )}
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

export default PayablesTracker;