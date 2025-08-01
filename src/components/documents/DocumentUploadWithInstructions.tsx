import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, FileText, Eye, Download, User, AlertCircle } from "lucide-react";
import { Document } from "@/types/settlement";
import { Textarea } from "@/components/ui/textarea";

const DocumentUploadWithInstructions = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "D001",
      name: "Medical Bill Reduction Agreement.pdf",
      type: "agreement",
      url: "/documents/reduction-agreement-001.pdf",
      uploadedDate: "2024-07-20",
      instructions: "Review terms and obtain client signature",
      followUpSteps: ["Send to client for signature", "File original with case records"],
      assignedTo: "Sarah Johnson",
      status: "pending_review"
    },
    {
      id: "D002",
      name: "Insurance Correspondence.pdf",
      type: "correspondence",
      url: "/documents/insurance-letter-002.pdf",
      uploadedDate: "2024-07-22",
      instructions: "Response to insurance company regarding coverage dispute",
      followUpSteps: ["Schedule follow-up call", "Prepare additional documentation"],
      assignedTo: "Mike Chen",
      status: "action_required"
    }
  ]);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Document>>({
    name: '',
    type: 'other',
    instructions: '',
    followUpSteps: [],
    assignedTo: '',
    status: 'pending_review'
  });
  const [followUpStepsText, setFollowUpStepsText] = useState('');

  const handleUpload = () => {
    const newDocument: Document = {
      id: `D${(documents.length + 1).toString().padStart(3, '0')}`,
      name: formData.name || '',
      type: formData.type || 'other',
      url: `/documents/${formData.name?.toLowerCase().replace(/\s+/g, '-')}`,
      uploadedDate: new Date().toISOString().split('T')[0],
      instructions: formData.instructions,
      followUpSteps: followUpStepsText ? followUpStepsText.split('\n').filter(step => step.trim()) : [],
      assignedTo: formData.assignedTo,
      status: formData.status || 'pending_review'
    };
    
    setDocuments([...documents, newDocument]);
    setFormData({
      name: '',
      type: 'other',
      instructions: '',
      followUpSteps: [],
      assignedTo: '',
      status: 'pending_review'
    });
    setFollowUpStepsText('');
    setIsUploadDialogOpen(false);
  };

  const updateDocumentStatus = (id: string, status: Document['status']) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, status } : d));
  };

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'agreement': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'correspondence': return <FileText className="w-4 h-4 text-green-600" />;
      case 'invoice': return <FileText className="w-4 h-4 text-orange-600" />;
      case 'medical_records': return <FileText className="w-4 h-4 text-purple-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'action_required': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'action_required': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  // Mock team members for assignment
  const teamMembers = [
    "Sarah Johnson",
    "Mike Chen",
    "Jennifer Davis",
    "Robert Wilson"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Document Management
              </CardTitle>
              <CardDescription>
                Upload documents with instructions and track follow-up actions
              </CardDescription>
            </div>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                  <DialogDescription>
                    Upload a document and provide instructions for handling
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fileName">Document Name *</Label>
                    <Input
                      id="fileName"
                      placeholder="e.g., Medical Bill Reduction Agreement.pdf"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type</Label>
                    <select
                      id="documentType"
                      className="w-full p-2 border rounded"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as Document['type'] })}
                    >
                      <option value="agreement">Agreement</option>
                      <option value="correspondence">Correspondence</option>
                      <option value="invoice">Invoice</option>
                      <option value="medical_records">Medical Records</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assign To</Label>
                    <select
                      id="assignedTo"
                      className="w-full p-2 border rounded"
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    >
                      <option value="">Select team member</option>
                      {teamMembers.map(member => (
                        <option key={member} value={member}>{member}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Provide specific instructions for handling this document..."
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="followUpSteps">Follow-up Steps</Label>
                    <Textarea
                      id="followUpSteps"
                      placeholder="Enter each follow-up step on a new line..."
                      value={followUpStepsText}
                      onChange={(e) => setFollowUpStepsText(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter each step on a separate line
                    </p>
                  </div>
                  
                  <div className="p-4 border-dashed border-2 border-gray-300 rounded-lg text-center">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop your file here
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload}>
                    Upload Document
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
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Instructions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(document.type)}
                      <div>
                        <div className="font-medium">{document.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Uploaded: {document.uploadedDate}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {document.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {document.assignedTo || 'Unassigned'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm truncate">{document.instructions}</p>
                      {document.followUpSteps && document.followUpSteps.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {document.followUpSteps.length} follow-up step{document.followUpSteps.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(document.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(document.status)}
                        {document.status.replace('_', ' ')}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      {document.status === 'pending_review' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateDocumentStatus(document.id, 'reviewed')}
                        >
                          Mark Reviewed
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

export default DocumentUploadWithInstructions;