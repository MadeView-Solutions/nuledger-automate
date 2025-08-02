import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenTool, Send, Eye, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface ESignatureRequest {
  id: string;
  clientName: string;
  caseId: string;
  documentType: string;
  provider: 'docusign' | 'hellosign' | 'adobe';
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'declined' | 'expired';
  sentDate?: string;
  signedDate?: string;
  expiryDate: string;
}

const ESignatureIntegration = () => {
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [caseId, setCaseId] = useState("");
  const [provider, setProvider] = useState<string>("");
  const [message, setMessage] = useState("");

  // Mock data for demonstration
  const signatureRequests: ESignatureRequest[] = [
    {
      id: "ESR001",
      clientName: "John Smith",
      caseId: "CASE001",
      documentType: "Settlement Agreement",
      provider: "docusign",
      status: "signed",
      sentDate: "2024-07-20",
      signedDate: "2024-07-22",
      expiryDate: "2024-08-20"
    },
    {
      id: "ESR002",
      clientName: "Jane Doe",
      caseId: "CASE002",
      documentType: "Disbursement Statement",
      provider: "hellosign",
      status: "sent",
      sentDate: "2024-07-23",
      expiryDate: "2024-08-23"
    },
    {
      id: "ESR003",
      clientName: "Bob Johnson",
      caseId: "CASE003",
      documentType: "Release Form",
      provider: "adobe",
      status: "viewed",
      sentDate: "2024-07-21",
      expiryDate: "2024-08-21"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <AlertCircle className="w-4 h-4 text-gray-500" />;
      case 'sent': return <Send className="w-4 h-4 text-blue-500" />;
      case 'viewed': return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'signed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'declined': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'expired': return <Clock className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'default';
      case 'sent': return 'secondary';
      case 'viewed': return 'outline';
      case 'declined': return 'destructive';
      case 'expired': return 'secondary';
      default: return 'secondary';
    }
  };

  const getProviderLogo = (provider: string) => {
    switch (provider) {
      case 'docusign': return '📝';
      case 'hellosign': return '✍️';
      case 'adobe': return '🔴';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Send New eSignature Request */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            Send Settlement for eSignature
          </CardTitle>
          <CardDescription>
            Send settlement breakdown to client for approval and signature
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caseId">Case ID</Label>
              <Input
                id="caseId"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                placeholder="CASE001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">eSignature Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docusign">DocuSign</SelectItem>
                  <SelectItem value="hellosign">HelloSign</SelectItem>
                  <SelectItem value="adobe">Adobe Sign</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message to Client</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please review and sign the attached settlement disbursement statement..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <Button className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send for Signature
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview Document
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Signature Requests History */}
      <Card>
        <CardHeader>
          <CardTitle>eSignature Requests</CardTitle>
          <CardDescription>
            Track the status of all signature requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Case ID</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead>Signed Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signatureRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.clientName}</TableCell>
                  <TableCell>{request.caseId}</TableCell>
                  <TableCell>{request.documentType}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{getProviderLogo(request.provider)}</span>
                      <span className="capitalize">{request.provider}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <Badge variant={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{request.sentDate || '-'}</TableCell>
                  <TableCell>{request.signedDate || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {request.status === 'sent' && (
                        <Button variant="outline" size="sm">
                          Remind
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

      {/* Provider Setup */}
      <Card>
        <CardHeader>
          <CardTitle>eSignature Provider Setup</CardTitle>
          <CardDescription>
            Configure your eSignature service integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <h3 className="font-semibold">DocuSign</h3>
                    <p className="text-sm text-muted-foreground">Enterprise solution</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600">Connected</Badge>
                <Button variant="outline" className="w-full mt-3" size="sm">
                  Configure
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">✍️</span>
                  <div>
                    <h3 className="font-semibold">HelloSign</h3>
                    <p className="text-sm text-muted-foreground">Simple & affordable</p>
                  </div>
                </div>
                <Badge variant="secondary">Not Connected</Badge>
                <Button variant="outline" className="w-full mt-3" size="sm">
                  Connect
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🔴</span>
                  <div>
                    <h3 className="font-semibold">Adobe Sign</h3>
                    <p className="text-sm text-muted-foreground">PDF workflows</p>
                  </div>
                </div>
                <Badge variant="secondary">Not Connected</Badge>
                <Button variant="outline" className="w-full mt-3" size="sm">
                  Connect
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ESignatureIntegration;