import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Users, FileText, DollarSign, Calculator, TrendingUp } from "lucide-react";

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'generating' | 'completed';
  generatedData: {
    clients?: number;
    legalCases?: number;
    settlements?: number;
    expenses?: number;
    transactions?: number;
    vendors?: number;
  };
}

const TestCaseGenerator = () => {
  const { toast } = useToast();
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [currentCase, setCurrentCase] = useState({
    name: '',
    description: '',
    clientCount: 5,
    caseCount: 8,
    settlementCount: 12,
    expenseCount: 25,
    transactionCount: 50,
    vendorCount: 15
  });

  const generateTestCase = async () => {
    if (!currentCase.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test case name",
        variant: "destructive"
      });
      return;
    }

    const newCase: TestCase = {
      id: `TC${Date.now()}`,
      name: currentCase.name,
      description: currentCase.description,
      status: 'generating',
      generatedData: {}
    };

    setTestCases(prev => [...prev, newCase]);

    // Simulate data generation process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const completedCase: TestCase = {
      ...newCase,
      status: 'completed',
      generatedData: {
        clients: currentCase.clientCount,
        legalCases: currentCase.caseCount,
        settlements: currentCase.settlementCount,
        expenses: currentCase.expenseCount,
        transactions: currentCase.transactionCount,
        vendors: currentCase.vendorCount
      }
    };

    setTestCases(prev => prev.map(tc => tc.id === newCase.id ? completedCase : tc));

    toast({
      title: "Test Case Generated",
      description: `Successfully generated ${currentCase.name} with comprehensive test data`,
    });

    // Reset form
    setCurrentCase({
      name: '',
      description: '',
      clientCount: 5,
      caseCount: 8,
      settlementCount: 12,
      expenseCount: 25,
      transactionCount: 50,
      vendorCount: 15
    });
  };

  const generatePredefinedCases = async () => {
    const predefinedCases = [
      {
        name: "Personal Injury Law Firm",
        description: "Complete dataset for PI firm with multiple active cases, settlements, and client relationships",
        clientCount: 15,
        caseCount: 25,
        settlementCount: 18,
        expenseCount: 75,
        transactionCount: 150,
        vendorCount: 20
      },
      {
        name: "Small Business Accounting",
        description: "Small business with QuickBooks integration, regular transactions, and vendor relationships",
        clientCount: 8,
        caseCount: 0,
        settlementCount: 0,
        expenseCount: 45,
        transactionCount: 200,
        vendorCount: 12
      },
      {
        name: "Corporate Legal Department",
        description: "Large corporation with complex cases, multiple attorneys, and high-value settlements",
        clientCount: 5,
        caseCount: 35,
        settlementCount: 25,
        expenseCount: 100,
        transactionCount: 300,
        vendorCount: 30
      },
      {
        name: "Boutique Tax Firm",
        description: "Tax-focused firm with seasonal patterns and diverse client base",
        clientCount: 25,
        caseCount: 5,
        settlementCount: 2,
        expenseCount: 60,
        transactionCount: 180,
        vendorCount: 8
      },
      {
        name: "Multi-Practice Law Firm",
        description: "Full-service law firm with PI, corporate, and family law practices",
        clientCount: 20,
        caseCount: 40,
        settlementCount: 30,
        expenseCount: 120,
        transactionCount: 250,
        vendorCount: 25
      }
    ];

    for (const caseData of predefinedCases) {
      const newCase: TestCase = {
        id: `TC${Date.now()}_${Math.random()}`,
        name: caseData.name,
        description: caseData.description,
        status: 'generating',
        generatedData: {}
      };

      setTestCases(prev => [...prev, newCase]);

      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const completedCase: TestCase = {
        ...newCase,
        status: 'completed',
        generatedData: {
          clients: caseData.clientCount,
          legalCases: caseData.caseCount,
          settlements: caseData.settlementCount,
          expenses: caseData.expenseCount,
          transactions: caseData.transactionCount,
          vendors: caseData.vendorCount
        }
      };

      setTestCases(prev => prev.map(tc => tc.id === newCase.id ? completedCase : tc));
    }

    toast({
      title: "All Test Cases Generated",
      description: "Successfully generated all 5 predefined test cases with comprehensive data",
    });
  };

  const getStatusBadge = (status: TestCase['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'generating':
        return <Badge variant="secondary">Generating...</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Test Case Generator</h1>
          <p className="text-muted-foreground mt-2">
            Generate comprehensive test data across all platform features
          </p>
        </div>
        <Button onClick={generatePredefinedCases} size="lg">
          Generate All 5 Test Cases
        </Button>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Create Custom Test Case</TabsTrigger>
          <TabsTrigger value="existing">Existing Test Cases ({testCases.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Test Case</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Test Case Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Personal Injury Law Firm"
                    value={currentCase.name}
                    onChange={(e) => setCurrentCase(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the test scenario..."
                    value={currentCase.description}
                    onChange={(e) => setCurrentCase(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clients">Clients</Label>
                  <Input
                    id="clients"
                    type="number"
                    min="1"
                    max="50"
                    value={currentCase.clientCount}
                    onChange={(e) => setCurrentCase(prev => ({ ...prev, clientCount: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cases">Legal Cases</Label>
                  <Input
                    id="cases"
                    type="number"
                    min="0"
                    max="100"
                    value={currentCase.caseCount}
                    onChange={(e) => setCurrentCase(prev => ({ ...prev, caseCount: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settlements">Settlements</Label>
                  <Input
                    id="settlements"
                    type="number"
                    min="0"
                    max="100"
                    value={currentCase.settlementCount}
                    onChange={(e) => setCurrentCase(prev => ({ ...prev, settlementCount: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expenses">Expenses</Label>
                  <Input
                    id="expenses"
                    type="number"
                    min="0"
                    max="500"
                    value={currentCase.expenseCount}
                    onChange={(e) => setCurrentCase(prev => ({ ...prev, expenseCount: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transactions">Transactions</Label>
                  <Input
                    id="transactions"
                    type="number"
                    min="0"
                    max="1000"
                    value={currentCase.transactionCount}
                    onChange={(e) => setCurrentCase(prev => ({ ...prev, transactionCount: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendors">Vendors</Label>
                  <Input
                    id="vendors"
                    type="number"
                    min="0"
                    max="100"
                    value={currentCase.vendorCount}
                    onChange={(e) => setCurrentCase(prev => ({ ...prev, vendorCount: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <Button onClick={generateTestCase} className="w-full">
                Generate Test Case
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="existing">
          <div className="grid gap-4">
            {testCases.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Test Cases Yet</h3>
                  <p className="text-muted-foreground">
                    Create your first test case or generate all 5 predefined test cases
                  </p>
                </CardContent>
              </Card>
            ) : (
              testCases.map((testCase) => (
                <Card key={testCase.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{testCase.name}</h3>
                        <p className="text-muted-foreground">{testCase.description}</p>
                      </div>
                      {getStatusBadge(testCase.status)}
                    </div>
                    
                    {testCase.status === 'completed' && testCase.generatedData && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">
                            <strong>{testCase.generatedData.clients}</strong> Clients
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="text-sm">
                            <strong>{testCase.generatedData.legalCases}</strong> Cases
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">
                            <strong>{testCase.generatedData.settlements}</strong> Settlements
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calculator className="w-4 h-4 text-orange-600" />
                          <span className="text-sm">
                            <strong>{testCase.generatedData.expenses}</strong> Expenses
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-red-600" />
                          <span className="text-sm">
                            <strong>{testCase.generatedData.transactions}</strong> Transactions
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-teal-600" />
                          <span className="text-sm">
                            <strong>{testCase.generatedData.vendors}</strong> Vendors
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestCaseGenerator;