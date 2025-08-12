import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Send, CheckCircle, XCircle, Clock } from "lucide-react";
import { ReductionRequest } from "@/types/settlement";
import { Textarea } from "@/components/ui/textarea";

const ReductionRequestWorkflow = () => {
  const [requests, setRequests] = useState<ReductionRequest[]>([
    {
      id: "RR001",
      lienId: "L001",
      caseId: "C001",
      creditorName: "City Medical Center",
      originalAmount: 15000,
      requestedAmount: 8000,
      status: "submitted",
      submittedDate: "2024-07-20",
      documents: [],
      notes: "Standard reduction request for PI settlement"
    },
    {
      id: "RR002",
      lienId: "L002",
      caseId: "C002",
      creditorName: "Metro Hospital",
      originalAmount: 25000,
      requestedAmount: 12000,
      status: "approved",
      submittedDate: "2024-07-15",
      responseDate: "2024-07-28",
      finalAmount: 10000,
      documents: [],
      notes: "Negotiated down from original request"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ReductionRequest>>({
    creditorName: '',
    originalAmount: 0,
    requestedAmount: 0,
    status: 'draft',
    notes: ''
  });

  const handleAddRequest = () => {
    const newRequest: ReductionRequest = {
      id: `RR${(requests.length + 1).toString().padStart(3, '0')}`,
      lienId: `L${(requests.length + 1).toString().padStart(3, '0')}`,
      caseId: 'C001', // This would come from case context
      creditorName: formData.creditorName || '',
      originalAmount: formData.originalAmount || 0,
      requestedAmount: formData.requestedAmount || 0,
      status: formData.status || 'draft',
      documents: [],
      notes: formData.notes
    };
    
    setRequests([...requests, newRequest]);
    setFormData({
      creditorName: '',
      originalAmount: 0,
      requestedAmount: 0,
      status: 'draft',
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const updateRequestStatus = (id: string, status: ReductionRequest['status'], finalAmount?: number) => {
    setRequests(requests.map(r => {
      if (r.id === id) {
        const updates: Partial<ReductionRequest> = { status };
        
        if (status === 'submitted' && !r.submittedDate) {
          updates.submittedDate = new Date().toISOString().split('T')[0];
        }
        
        if ((status === 'approved' || status === 'denied') && !r.responseDate) {
          updates.responseDate = new Date().toISOString().split('T')[0];
        }
        
        if (finalAmount !== undefined) {
          updates.finalAmount = finalAmount;
        }
        
        return { ...r, ...updates };
      }
      return r;
    }));
  };

  const getStatusIcon = (status: ReductionRequest['status']) => {
    switch (status) {
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'submitted': return <Send className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'denied': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ReductionRequest['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateSavings = (originalAmount: number, finalAmount?: number, requestedAmount?: number) => {
    const compareAmount = finalAmount || requestedAmount || originalAmount;
    return originalAmount - compareAmount;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reduction Request Workflow</CardTitle>
              <CardDescription>
                Manage lien and medical bill reduction requests
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Reduction Request</DialogTitle>
                  <DialogDescription>
                    Start a new lien or medical bill reduction request
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="creditorName">Creditor Name *</Label>
                    <Input
                      id="creditorName"
                      value={formData.creditorName}
                      onChange={(e) => setFormData({ ...formData, creditorName: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="originalAmount">Original Amount *</Label>
                      <Input
                        id="originalAmount"
                        type="number"
                        value={formData.originalAmount}
                        onChange={(e) => setFormData({ ...formData, originalAmount: Number(e.target.value) })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="requestedAmount">Requested Amount *</Label>
                      <Input
                        id="requestedAmount"
                        type="number"
                        value={formData.requestedAmount}
                        onChange={(e) => setFormData({ ...formData, requestedAmount: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  
                  {formData.originalAmount && formData.requestedAmount && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        Potential savings: ${(formData.originalAmount - formData.requestedAmount).toLocaleString()}
                        ({(((formData.originalAmount - formData.requestedAmount) / formData.originalAmount) * 100).toFixed(1)}% reduction)
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add context for the reduction request..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRequest}>
                    Create Draft
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
                <TableHead>Creditor</TableHead>
                <TableHead>Original Amount</TableHead>
                <TableHead>Reduced Amount</TableHead>
                <TableHead>Final Amount</TableHead>
                <TableHead>Savings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.creditorName}</div>
                      <div className="text-sm text-muted-foreground">
                        {request.submittedDate && `Submitted: ${request.submittedDate}`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${request.originalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-blue-600">
                    ${request.requestedAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-green-600">
                    {request.finalAmount ? `$${request.finalAmount.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="text-green-600 font-medium">
                      ${calculateSavings(request.originalAmount, request.finalAmount, request.requestedAmount).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        {request.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {request.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateRequestStatus(request.id, 'submitted')}
                        >
                          Submit
                        </Button>
                      )}
                      {request.status === 'submitted' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const finalAmount = prompt('Enter final agreed amount:');
                              if (finalAmount) {
                                updateRequestStatus(request.id, 'approved', Number(finalAmount));
                              }
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, 'denied')}
                          >
                            Deny
                          </Button>
                        </>
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

export default ReductionRequestWorkflow;