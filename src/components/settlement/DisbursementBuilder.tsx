import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, FileText, Send, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface DisbursementItem {
  id: string;
  type: 'attorney_fee' | 'lien' | 'vendor' | 'expense' | 'client';
  description: string;
  originalAmount: number;
  finalAmount: number;
  status: 'pending' | 'approved' | 'paid';
}

const DisbursementBuilder = () => {
  const [grossSettlement, setGrossSettlement] = useState("150000");
  const [attorneyFeePercent, setAttorneyFeePercent] = useState("33");
  const [disbursementItems, setDisbursementItems] = useState<DisbursementItem[]>([]);
  const [netToClient, setNetToClient] = useState(0);

  // Mock data for demonstration
  useEffect(() => {
    const mockItems: DisbursementItem[] = [
      {
        id: "1",
        type: "attorney_fee",
        description: "Attorney Fee (33%)",
        originalAmount: 49500,
        finalAmount: 49500,
        status: "approved"
      },
      {
        id: "2",
        type: "lien",
        description: "Medical Lien - City Hospital",
        originalAmount: 25000,
        finalAmount: 18000,
        status: "approved"
      },
      {
        id: "3",
        type: "vendor",
        description: "Expert Witness - Dr. Smith",
        originalAmount: 5000,
        finalAmount: 5000,
        status: "pending"
      },
      {
        id: "4",
        type: "expense",
        description: "Court Filing Fees",
        originalAmount: 500,
        finalAmount: 500,
        status: "approved"
      }
    ];
    setDisbursementItems(mockItems);
  }, []);

  useEffect(() => {
    const totalDeductions = disbursementItems.reduce((sum, item) => sum + item.finalAmount, 0);
    setNetToClient(parseFloat(grossSettlement) - totalDeductions);
  }, [grossSettlement, disbursementItems]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'paid': return 'outline';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'attorney_fee': return '⚖️';
      case 'lien': return '🏥';
      case 'vendor': return '👨‍💼';
      case 'expense': return '📄';
      case 'client': return '👤';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Settlement Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Settlement Disbursement Builder
          </CardTitle>
          <CardDescription>
            Auto-generate itemized breakdowns with original and final amounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grossSettlement">Gross Settlement Amount</Label>
              <Input
                id="grossSettlement"
                type="number"
                value={grossSettlement}
                onChange={(e) => setGrossSettlement(e.target.value)}
                placeholder="150000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attorneyFee">Attorney Fee (%)</Label>
              <Input
                id="attorneyFee"
                type="number"
                value={attorneyFeePercent}
                onChange={(e) => setAttorneyFeePercent(e.target.value)}
                placeholder="33"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disbursement Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Disbursement Breakdown</CardTitle>
          <CardDescription>
            Detailed breakdown of all deductions and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Original Amount</TableHead>
                <TableHead>Final Amount</TableHead>
                <TableHead>Savings</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disbursementItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{getTypeIcon(item.type)}</span>
                      <span className="capitalize">{item.type.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-red-600">
                    ${item.originalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${item.finalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-green-600">
                    ${(item.originalAmount - item.finalAmount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Separator className="my-4" />
          
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">
                  ${parseFloat(grossSettlement).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Gross Settlement</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">
                  ${disbursementItems.reduce((sum, item) => sum + item.finalAmount, 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Total Deductions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  ${netToClient.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Net to Client</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Generate Statement
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send for eSignature
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisbursementBuilder;