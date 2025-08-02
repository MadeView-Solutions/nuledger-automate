import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, Save, Printer, Eye, Calendar, DollarSign } from "lucide-react";

interface CheckData {
  checkNumber: string;
  date: string;
  payToOrder: string;
  amount: number;
  amountInWords: string;
  memo: string;
  bankAccount: string;
  signature: string;
}

const CheckWriter = () => {
  const [checkData, setCheckData] = useState<CheckData>({
    checkNumber: "1001",
    date: new Date().toISOString().split('T')[0],
    payToOrder: "",
    amount: 0,
    amountInWords: "",
    memo: "",
    bankAccount: "operating",
    signature: "John Smith, Managing Partner"
  });

  const [isPreview, setIsPreview] = useState(false);

  // Convert number to words for check writing
  const numberToWords = (num: number): string => {
    if (num === 0) return "Zero";
    
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const thousands = ["", "Thousand", "Million", "Billion"];

    const convertHundreds = (n: number): string => {
      let result = "";
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + " ";
        return result;
      }
      if (n > 0) {
        result += ones[n] + " ";
      }
      return result;
    };

    const dollars = Math.floor(num);
    const cents = Math.round((num - dollars) * 100);
    
    let result = "";
    let dollarsStr = dollars.toString();
    let groupIndex = 0;
    
    while (dollarsStr.length > 0) {
      let group = parseInt(dollarsStr.slice(-3));
      dollarsStr = dollarsStr.slice(0, -3);
      
      if (group > 0) {
        result = convertHundreds(group) + thousands[groupIndex] + " " + result;
      }
      groupIndex++;
    }
    
    result = result.trim();
    if (result === "") result = "Zero";
    
    result += " Dollars";
    if (cents > 0) {
      result += ` and ${cents}/100`;
    } else {
      result += " and 00/100";
    }
    
    return result;
  };

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setCheckData(prev => ({
      ...prev,
      amount,
      amountInWords: numberToWords(amount)
    }));
  };

  const bankAccounts = [
    { value: "operating", label: "Operating Account - *1234", routing: "123456789" },
    { value: "trust", label: "Trust Account - *5678", routing: "987654321" },
    { value: "client", label: "Client Funds - *9012", routing: "456789123" }
  ];

  const selectedAccount = bankAccounts.find(acc => acc.value === checkData.bankAccount);

  return (
    <div className="space-y-6">
      {/* Check Writing Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Write New Check
          </CardTitle>
          <CardDescription>
            Create and print individual checks with proper formatting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkNumber">Check Number</Label>
              <Input
                id="checkNumber"
                value={checkData.checkNumber}
                onChange={(e) => setCheckData(prev => ({ ...prev, checkNumber: e.target.value }))}
                placeholder="1001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={checkData.date}
                onChange={(e) => setCheckData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccount">Bank Account</Label>
              <Select value={checkData.bankAccount} onValueChange={(value) => setCheckData(prev => ({ ...prev, bankAccount: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.value} value={account.value}>
                      {account.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payToOrder">Pay to the Order of</Label>
              <Input
                id="payToOrder"
                value={checkData.payToOrder}
                onChange={(e) => setCheckData(prev => ({ ...prev, payToOrder: e.target.value }))}
                placeholder="Enter payee name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={checkData.amount || ""}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amountInWords">Amount in Words</Label>
            <Input
              id="amountInWords"
              value={checkData.amountInWords}
              onChange={(e) => setCheckData(prev => ({ ...prev, amountInWords: e.target.value }))}
              placeholder="Amount will be auto-generated"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">Memo</Label>
            <Input
              id="memo"
              value={checkData.memo}
              onChange={(e) => setCheckData(prev => ({ ...prev, memo: e.target.value }))}
              placeholder="Purpose of payment"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setIsPreview(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview Check
            </Button>
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print Check
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Check Preview */}
      {isPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Check Preview</CardTitle>
            <CardDescription>
              Preview how your check will appear when printed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 p-6 bg-gray-50 rounded-lg">
              <div className="bg-white p-8 rounded shadow-sm border" style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
                {/* Check Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold">Law Firm Name</h3>
                    <p className="text-sm text-gray-600">123 Legal Street</p>
                    <p className="text-sm text-gray-600">City, State 12345</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Check #{checkData.checkNumber}</div>
                    <div className="text-sm text-gray-600">{checkData.date}</div>
                  </div>
                </div>

                {/* Pay to Order */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Pay to the Order of:</span>
                    <div className="flex-1 border-b border-gray-300 pb-1">
                      <span className="text-sm font-medium">{checkData.payToOrder || "_____________________"}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm">$</span>
                      <span className="text-lg font-bold border border-gray-300 px-2 py-1 ml-1">
                        {checkData.amount ? checkData.amount.toFixed(2) : "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount in Words */}
                <div className="mb-4">
                  <div className="border-b border-gray-300 pb-1">
                    <span className="text-sm">
                      {checkData.amountInWords || "_____________________________________________"}
                    </span>
                  </div>
                </div>

                {/* Memo and Signature */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Memo:</div>
                    <div className="border-b border-gray-300 pb-1 min-w-32">
                      <span className="text-sm">{checkData.memo || "_____________"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="border-b border-gray-300 pb-1 min-w-48">
                      <span className="text-sm">{checkData.signature}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Signature</div>
                  </div>
                </div>

                {/* Bank Info */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>:{selectedAccount?.routing}:</span>
                    <span>{selectedAccount?.label}</span>
                    <span>:{checkData.checkNumber}:</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setIsPreview(false)} variant="outline">
                Edit Check
              </Button>
              <Button>
                <Printer className="w-4 h-4 mr-2" />
                Print This Check
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Check Templates</CardTitle>
          <CardDescription>
            Pre-fill common check types to speed up writing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:bg-gray-50" onClick={() => {
              setCheckData(prev => ({
                ...prev,
                payToOrder: "",
                amount: 0,
                memo: "Settlement Payment",
                amountInWords: ""
              }));
            }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Settlement Payment</h3>
                    <p className="text-sm text-muted-foreground">Client settlement check</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-gray-50" onClick={() => {
              setCheckData(prev => ({
                ...prev,
                payToOrder: "",
                amount: 0,
                memo: "Vendor Payment",
                amountInWords: ""
              }));
            }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">Vendor Payment</h3>
                    <p className="text-sm text-muted-foreground">Expert witness, court reporter</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-gray-50" onClick={() => {
              setCheckData(prev => ({
                ...prev,
                payToOrder: "",
                amount: 0,
                memo: "Lien Payment",
                amountInWords: ""
              }));
            }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Badge className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold">Lien Payment</h3>
                    <p className="text-sm text-muted-foreground">Medical liens, subrogation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckWriter;