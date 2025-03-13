
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import TaxStats from "./TaxStats";
import { useToast } from "@/hooks/use-toast";

const TaxCalculator = () => {
  const { toast } = useToast();
  const [income, setIncome] = useState(75000);
  const [deductions, setDeductions] = useState(12950);
  const [taxableIncome, setTaxableIncome] = useState(income - deductions);
  const [federalTax, setFederalTax] = useState(8925);
  const [stateTax, setStateTax] = useState(3520);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    // Simulate API call to AI tax calculation service
    setTimeout(() => {
      const newTaxableIncome = income - deductions;
      setTaxableIncome(newTaxableIncome);
      
      // Simple progressive tax calculation (just for demonstration)
      let newFederalTax = 0;
      if (newTaxableIncome <= 10275) {
        newFederalTax = newTaxableIncome * 0.10;
      } else if (newTaxableIncome <= 41775) {
        newFederalTax = 1027.50 + (newTaxableIncome - 10275) * 0.12;
      } else if (newTaxableIncome <= 89075) {
        newFederalTax = 4807.50 + (newTaxableIncome - 41775) * 0.22;
      } else if (newTaxableIncome <= 170050) {
        newFederalTax = 15213.50 + (newTaxableIncome - 89075) * 0.24;
      } else {
        newFederalTax = 34647.50 + (newTaxableIncome - 170050) * 0.32;
      }
      
      // Simple state tax calculation (approximation)
      const newStateTax = newTaxableIncome * 0.045;
      
      setFederalTax(Math.round(newFederalTax));
      setStateTax(Math.round(newStateTax));
      setIsCalculating(false);
      
      toast({
        title: "Tax calculation complete",
        description: "Your estimated tax liability has been updated",
      });
    }, 1500);
  };
  
  return (
    <div className="space-y-8">
      <TaxStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Tax Calculator
                <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-950">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </CardTitle>
              <CardDescription>
                Calculate your estimated tax liability with real-time IRS code compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="income" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="deductions">Deductions</TabsTrigger>
                  <TabsTrigger value="credits">Credits</TabsTrigger>
                </TabsList>
                
                <TabsContent value="income" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="salary">Annual Salary</Label>
                      <span className="text-muted-foreground">${income.toLocaleString()}</span>
                    </div>
                    <Slider
                      id="salary"
                      min={0}
                      max={250000}
                      step={1000}
                      value={[income]}
                      onValueChange={(value) => setIncome(value[0])}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="interest">Interest Income</Label>
                      <Input id="interest" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dividends">Dividend Income</Label>
                      <Input id="dividends" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business">Business Income</Label>
                      <Input id="business" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capital-gains">Capital Gains</Label>
                      <Input id="capital-gains" type="number" placeholder="0" />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="deductions" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="standard-deduction">Standard Deduction</Label>
                      <span className="text-muted-foreground">${deductions.toLocaleString()}</span>
                    </div>
                    <Slider
                      id="standard-deduction"
                      min={0}
                      max={25000}
                      step={100}
                      value={[deductions]}
                      onValueChange={(value) => setDeductions(value[0])}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mortgage">Mortgage Interest</Label>
                      <Input id="mortgage" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="charity">Charitable Contributions</Label>
                      <Input id="charity" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medical">Medical Expenses</Label>
                      <Input id="medical" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retirement">Retirement Contributions</Label>
                      <Input id="retirement" type="number" placeholder="0" />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="credits" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="child-credit">Child Tax Credit</Label>
                      <Input id="child-credit" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">Education Credits</Label>
                      <Input id="education" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="energy">Energy Efficiency Credits</Label>
                      <Input id="energy" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="other-credits">Other Credits</Label>
                      <Input id="other-credits" type="number" placeholder="0" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="justify-between border-t bg-muted/50 px-6 py-3">
              <div className="text-sm text-muted-foreground">
                Our AI ensures calculations comply with latest tax regulations
              </div>
              <Button onClick={handleCalculate} disabled={isCalculating}>
                {isCalculating ? "Calculating..." : "Calculate Taxes"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tax Summary</CardTitle>
              <CardDescription>
                Estimated tax liability breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Income</span>
                  <span className="font-medium">${income.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Deductions</span>
                  <span className="font-medium">-${deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center font-semibold border-t pt-2">
                  <span>Taxable Income</span>
                  <span>${taxableIncome.toLocaleString()}</span>
                </div>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Federal Income Tax</span>
                    <span className="font-medium">${federalTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">State Income Tax</span>
                    <span className="font-medium">${stateTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2 text-lg font-bold">
                    <span>Total Tax Due</span>
                    <span>${(federalTax + stateTax).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-sm">
                  <p className="font-medium text-green-800 dark:text-green-400">AI Tax Insights</p>
                  <p className="mt-1 text-green-700 dark:text-green-300">
                    You could save up to $2,450 by maximizing your retirement contributions and taking advantage of energy efficiency credits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
