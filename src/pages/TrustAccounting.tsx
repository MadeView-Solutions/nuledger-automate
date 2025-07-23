import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, DollarSign, Users, Scale, FileText, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TrustAccounting = () => {
  const [settlementAmount, setSettlementAmount] = useState("");
  const [attorneyFeePercent, setAttorneyFeePercent] = useState("33");
  const [medicalLiens, setMedicalLiens] = useState("");

  // Mock data for client trust balances
  const trustBalances = [
    { clientId: "C001", clientName: "John Smith", balance: 45000, status: "Active" },
    { clientId: "C002", clientName: "Jane Doe", balance: 78500, status: "Pending Settlement" },
    { clientId: "C003", clientName: "Bob Johnson", balance: 12300, status: "Active" },
    { clientId: "C004", clientName: "Mary Wilson", balance: 156000, status: "In Litigation" },
  ];

  // Calculate settlement breakdown
  const calculateDisbursement = () => {
    const settlement = parseFloat(settlementAmount) || 0;
    const feePercent = parseFloat(attorneyFeePercent) || 0;
    const liens = parseFloat(medicalLiens) || 0;
    
    const attorneyFee = settlement * (feePercent / 100);
    const clientPortion = settlement - attorneyFee - liens;
    
    return {
      settlement,
      attorneyFee,
      medicalLiens: liens,
      clientPortion
    };
  };

  const disbursement = calculateDisbursement();

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Trust Accounting</h1>
            <p className="text-muted-foreground">
              Manage client trust balances and IOLTA compliance
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Trust Transaction
          </Button>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            IOLTA Compliance: All client funds are maintained in separate trust accounts as required by state bar regulations.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="balances" className="space-y-4">
          <TabsList>
            <TabsTrigger value="balances">Trust Balances</TabsTrigger>
            <TabsTrigger value="disbursement">Settlement Calculator</TabsTrigger>
            <TabsTrigger value="reconciliation">IOLTA Reconciliation</TabsTrigger>
          </TabsList>

          <TabsContent value="balances" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Trust Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$291,800</div>
                  <p className="text-xs text-muted-foreground">
                    Across 4 active clients
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">
                    With trust balances
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Settlements</CardTitle>
                  <Scale className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">
                    Ready for disbursement
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">IOLTA Status</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Compliant</div>
                  <p className="text-xs text-muted-foreground">
                    Last reconciled today
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Client Trust Balances</CardTitle>
                <CardDescription>
                  Individual trust account balances by client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client ID</TableHead>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Trust Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trustBalances.map((client) => (
                      <TableRow key={client.clientId}>
                        <TableCell className="font-medium">{client.clientId}</TableCell>
                        <TableCell>{client.clientName}</TableCell>
                        <TableCell>${client.balance.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={client.status === "Active" ? "default" : "secondary"}>
                            {client.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disbursement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Settlement Disbursement Calculator</CardTitle>
                <CardDescription>
                  Calculate attorney fees, client portions, and lien payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="settlement">Total Settlement Amount</Label>
                    <Input
                      id="settlement"
                      type="number"
                      placeholder="100000"
                      value={settlementAmount}
                      onChange={(e) => setSettlementAmount(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fee">Attorney Fee (%)</Label>
                    <Input
                      id="fee"
                      type="number"
                      placeholder="33"
                      value={attorneyFeePercent}
                      onChange={(e) => setAttorneyFeePercent(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="liens">Medical Liens</Label>
                    <Input
                      id="liens"
                      type="number"
                      placeholder="7000"
                      value={medicalLiens}
                      onChange={(e) => setMedicalLiens(e.target.value)}
                    />
                  </div>
                </div>

                {settlementAmount && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="text-lg font-semibold mb-4">Disbursement Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ${disbursement.settlement.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Settlement</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          ${disbursement.clientPortion.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Client Portion</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          ${disbursement.attorneyFee.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Attorney Fee</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          ${disbursement.medicalLiens.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Medical Liens</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reconciliation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>IOLTA Reconciliation</CardTitle>
                <CardDescription>
                  Ensure compliance with state bar regulations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Trust account reconciliation tools and compliance reporting will be available in the next update.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20">
                      <div className="text-center">
                        <FileText className="h-6 w-6 mx-auto mb-2" />
                        <div>Generate IOLTA Report</div>
                      </div>
                    </Button>
                    
                    <Button variant="outline" className="h-20">
                      <div className="text-center">
                        <Scale className="h-6 w-6 mx-auto mb-2" />
                        <div>Reconcile Trust Accounts</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TrustAccounting;