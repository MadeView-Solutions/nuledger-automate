
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CheckCircle2, RefreshCcw } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

// Mock reconciliation history data
const reconciliationHistory = [
  {
    id: "REC001",
    date: "2023-06-01",
    account: "Business Checking",
    transactionsMatched: 156,
    transactionsFlagged: 3,
    balanceDifference: 0,
    status: "completed",
    completedBy: "AI Assistant"
  },
  {
    id: "REC002",
    date: "2023-05-15",
    account: "Business Checking",
    transactionsMatched: 143,
    transactionsFlagged: 5,
    balanceDifference: -125.45,
    status: "completed",
    completedBy: "John Smith"
  },
  {
    id: "REC003",
    date: "2023-05-01",
    account: "Corporate Card",
    transactionsMatched: 87,
    transactionsFlagged: 2,
    balanceDifference: 0,
    status: "completed",
    completedBy: "AI Assistant"
  },
  {
    id: "REC004",
    date: "2023-04-15",
    account: "Business Checking",
    transactionsMatched: 132,
    transactionsFlagged: 0,
    balanceDifference: 0,
    status: "completed",
    completedBy: "John Smith"
  },
];

const ReconciliationHistory = () => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Reconciliation History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reconciliationHistory.map((record) => (
            <div 
              key={record.id} 
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{record.account} Reconciliation</h3>
                    <Badge 
                      variant={record.balanceDifference === 0 ? "default" : "destructive"}
                      className="ml-2"
                    >
                      {record.balanceDifference === 0 ? "Balanced" : "Unbalanced"}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {new Date(record.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <div className="text-sm">
                    Completed by: <span className="font-medium">{record.completedBy}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-muted rounded-md p-3">
                  <div className="text-xs text-muted-foreground">Transactions Processed</div>
                  <div className="text-xl font-medium mt-1">
                    {record.transactionsMatched + record.transactionsFlagged}
                  </div>
                </div>
                <div className="bg-muted rounded-md p-3">
                  <div className="text-xs text-muted-foreground">Successfully Matched</div>
                  <div className="flex items-center mt-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xl font-medium">{record.transactionsMatched}</span>
                  </div>
                </div>
                <div className="bg-muted rounded-md p-3">
                  <div className="text-xs text-muted-foreground">Flagged Issues</div>
                  <div className="text-xl font-medium mt-1">
                    {record.transactionsFlagged}
                  </div>
                </div>
                <div className="bg-muted rounded-md p-3">
                  <div className="text-xs text-muted-foreground">Balance Difference</div>
                  <div className="text-xl font-medium mt-1">
                    {formatCurrency(record.balanceDifference)}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button className="text-sm text-primary flex items-center">
                  <RefreshCcw className="h-3 w-3 mr-1" />
                  Run Again
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReconciliationHistory;
