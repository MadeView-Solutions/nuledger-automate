
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { mockTransactions } from "./transactions/TransactionTypes";
import TransactionSearch from "./transactions/TransactionSearch";
import TransactionActions from "./transactions/TransactionActions";
import TransactionTable from "./transactions/TransactionTable";
import TransactionFooter from "./transactions/TransactionFooter";

const TransactionManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const handleRunAI = () => {
    toast({
      title: "AI Processing Started",
      description: "AI is analyzing and categorizing your transactions. This may take a few moments.",
      duration: 5000,
    });
    // In a real app, this would call an API to trigger AI processing
  };

  const handleImport = () => {
    toast({
      title: "Import Successful",
      description: "Your transactions have been imported and are being processed.",
      duration: 3000,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Completed",
      description: "Your transactions have been exported successfully.",
      duration: 3000,
    });
  };

  const filteredTransactions = mockTransactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Transaction Management</CardTitle>
        <CardDescription>
          AI-powered transaction categorization and management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <TransactionSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            <TransactionActions
              onRunAI={handleRunAI}
              onImport={handleImport}
              onExport={handleExport}
            />
          </div>

          <TransactionTable transactions={filteredTransactions} />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <TransactionFooter 
          filteredCount={filteredTransactions.length} 
          totalCount={mockTransactions.length}
        />
      </CardFooter>
    </Card>
  );
};

export default TransactionManager;
