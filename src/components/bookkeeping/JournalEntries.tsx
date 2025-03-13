
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Sparkles, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock journal entries data
const journalEntries = [
  {
    id: "JE001",
    date: "2023-06-10",
    description: "Monthly Rent Payment",
    status: "ai-generated",
    entries: [
      { account: "Rent Expense", debit: 2000.00, credit: 0 },
      { account: "Bank Account", debit: 0, credit: 2000.00 }
    ]
  },
  {
    id: "JE002",
    date: "2023-06-08",
    description: "Client Payment - ABC Corp",
    status: "ai-generated",
    entries: [
      { account: "Bank Account", debit: 5420.80, credit: 0 },
      { account: "Accounts Receivable", debit: 0, credit: 5420.80 }
    ]
  },
  {
    id: "JE003",
    date: "2023-06-05",
    description: "Office Supplies Purchase",
    status: "manual",
    entries: [
      { account: "Office Supplies Expense", debit: 231.50, credit: 0 },
      { account: "Bank Account", debit: 0, credit: 231.50 }
    ]
  },
];

const JournalEntries = () => {
  const { toast } = useToast();

  const handleGenerateEntries = () => {
    toast({
      title: "AI Journal Generation Started",
      description: "AI is analyzing your transactions and generating journal entries. This may take a few moments.",
      duration: 5000,
    });
    // In a real app, this would call an API to trigger AI processing
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Journal Entries</CardTitle>
            <CardDescription>
              AI-automated journal entries from transaction data
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </Button>
            <Button variant="default" size="sm" onClick={handleGenerateEntries}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {journalEntries.map((journal) => (
            <div 
              key={journal.id} 
              className="border rounded-lg p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">{journal.description}</h3>
                  <div className="text-sm text-muted-foreground">
                    {journal.id} • {new Date(journal.date).toLocaleDateString()}
                  </div>
                </div>
                <Badge 
                  variant={journal.status === "ai-generated" ? "default" : "outline"}
                  className={journal.status === "ai-generated" ? "bg-nuledger-500" : ""}
                >
                  {journal.status === "ai-generated" ? "AI Generated" : "Manual"}
                </Badge>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Account</th>
                      <th className="text-right p-2">Debit</th>
                      <th className="text-right p-2">Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {journal.entries.map((entry, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="p-2">{entry.account}</td>
                        <td className={`text-right p-2 ${entry.debit ? "font-medium" : ""}`}>
                          {entry.debit ? `$${entry.debit.toFixed(2)}` : "—"}
                        </td>
                        <td className={`text-right p-2 ${entry.credit ? "font-medium" : ""}`}>
                          {entry.credit ? `$${entry.credit.toFixed(2)}` : "—"}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30">
                      <td className="p-2 font-medium">Total</td>
                      <td className="text-right p-2 font-medium">
                        ${journal.entries.reduce((sum, entry) => sum + entry.debit, 0).toFixed(2)}
                      </td>
                      <td className="text-right p-2 font-medium">
                        ${journal.entries.reduce((sum, entry) => sum + entry.credit, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="text-sm text-muted-foreground">
          Showing {journalEntries.length} journal entries
        </div>
      </CardFooter>
    </Card>
  );
};

export default JournalEntries;
