import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Calculator } from "lucide-react";
import { SettlementCalculation, Lien, VendorPayment } from "@/types/settlement";

interface SettlementCalculatorProps {
  caseId?: string;
  onSave?: (calculation: SettlementCalculation) => void;
}

const SettlementCalculator: React.FC<SettlementCalculatorProps> = ({ caseId, onSave }) => {
  const [grossSettlement, setGrossSettlement] = useState<number>(0);
  const [attorneyFeePercent, setAttorneyFeePercent] = useState<number>(33);
  const [expenses, setExpenses] = useState<number>(0);
  const [liens, setLiens] = useState<Lien[]>([]);
  const [vendorPayments, setVendorPayments] = useState<VendorPayment[]>([]);
  const [scenarioName, setScenarioName] = useState<string>("");

  const attorneyFee = (grossSettlement * attorneyFeePercent) / 100;
  const totalLiens = liens.reduce((sum, lien) => sum + (lien.negotiatedAmount || lien.originalAmount), 0);
  const totalVendorPayments = vendorPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const netToClient = grossSettlement - attorneyFee - totalLiens - totalVendorPayments - expenses;

  const addLien = () => {
    const newLien: Lien = {
      id: Date.now().toString(),
      type: 'medical',
      creditorName: '',
      originalAmount: 0,
      status: 'pending'
    };
    setLiens([...liens, newLien]);
  };

  const updateLien = (id: string, updates: Partial<Lien>) => {
    setLiens(liens.map(lien => lien.id === id ? { ...lien, ...updates } : lien));
  };

  const removeLien = (id: string) => {
    setLiens(liens.filter(lien => lien.id !== id));
  };

  const addVendorPayment = () => {
    const newPayment: VendorPayment = {
      id: Date.now().toString(),
      vendorId: '',
      vendorName: '',
      amount: 0,
      description: '',
      status: 'pending'
    };
    setVendorPayments([...vendorPayments, newPayment]);
  };

  const updateVendorPayment = (id: string, updates: Partial<VendorPayment>) => {
    setVendorPayments(vendorPayments.map(payment => payment.id === id ? { ...payment, ...updates } : payment));
  };

  const removeVendorPayment = (id: string) => {
    setVendorPayments(vendorPayments.filter(payment => payment.id !== id));
  };

  const handleSave = () => {
    const calculation: SettlementCalculation = {
      id: Date.now().toString(),
      caseId: caseId || '',
      grossSettlement,
      attorneyFeePercent,
      attorneyFee,
      liens,
      vendorPayments,
      expenses,
      netToClient,
      dateCreated: new Date().toISOString(),
      scenarioName: scenarioName || `Scenario ${new Date().toLocaleDateString()}`
    };
    
    onSave?.(calculation);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Settlement Calculator
          </CardTitle>
          <CardDescription>
            Calculate settlement distributions and create scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scenarioName">Scenario Name</Label>
              <Input
                id="scenarioName"
                placeholder="e.g., Base Scenario"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grossSettlement">Gross Settlement ($)</Label>
              <Input
                id="grossSettlement"
                type="number"
                value={grossSettlement}
                onChange={(e) => setGrossSettlement(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="attorneyFee">Attorney Fee (%)</Label>
              <Input
                id="attorneyFee"
                type="number"
                value={attorneyFeePercent}
                onChange={(e) => setAttorneyFeePercent(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenses">Case Expenses ($)</Label>
            <Input
              id="expenses"
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Liens Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liens & Medical Bills</CardTitle>
            <Button onClick={addLien} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Lien
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {liens.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creditor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Original Amount</TableHead>
                  <TableHead>Negotiated Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liens.map((lien) => (
                  <TableRow key={lien.id}>
                    <TableCell>
                      <Input
                        placeholder="Creditor name"
                        value={lien.creditorName}
                        onChange={(e) => updateLien(lien.id, { creditorName: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <select
                        className="w-full p-2 border rounded"
                        value={lien.type}
                        onChange={(e) => updateLien(lien.id, { type: e.target.value as Lien['type'] })}
                      >
                        <option value="medical">Medical</option>
                        <option value="subrogation">Subrogation</option>
                        <option value="medicare">Medicare</option>
                        <option value="medicaid">Medicaid</option>
                        <option value="other">Other</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={lien.originalAmount}
                        onChange={(e) => updateLien(lien.id, { originalAmount: Number(e.target.value) })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={lien.negotiatedAmount || ''}
                        onChange={(e) => updateLien(lien.id, { negotiatedAmount: Number(e.target.value) })}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant={lien.status === 'paid' ? 'default' : 'secondary'}>
                        {lien.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeLien(lien.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No liens added yet</p>
          )}
        </CardContent>
      </Card>

      {/* Vendor Payments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vendor Payments</CardTitle>
            <Button onClick={addVendorPayment} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {vendorPayments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <Input
                        placeholder="Vendor name"
                        value={payment.vendorName}
                        onChange={(e) => updateVendorPayment(payment.id, { vendorName: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Description"
                        value={payment.description}
                        onChange={(e) => updateVendorPayment(payment.id, { description: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={payment.amount}
                        onChange={(e) => updateVendorPayment(payment.id, { amount: Number(e.target.value) })}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeVendorPayment(payment.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No vendor payments added yet</p>
          )}
        </CardContent>
      </Card>

      {/* Calculation Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Settlement Distribution Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Gross Settlement:</span>
              <span className="text-lg font-bold">${grossSettlement.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span>Attorney Fee ({attorneyFeePercent}%):</span>
              <span className="text-red-600">-${attorneyFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Liens:</span>
              <span className="text-red-600">-${totalLiens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Vendor Payments:</span>
              <span className="text-red-600">-${totalVendorPayments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Case Expenses:</span>
              <span className="text-red-600">-${expenses.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Net to Client:</span>
              <span className={`text-xl font-bold ${netToClient >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netToClient.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="mt-6 flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save Scenario
            </Button>
            <Button variant="outline" className="flex-1">
              Save as Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettlementCalculator;