
import React from "react";
import { cn } from "@/lib/utils";
import { MoreHorizontal, ArrowUpRight, ArrowDownLeft, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock transaction data
const transactions = [
  {
    id: "TX123456",
    description: "Client Payment - ABC Corp",
    date: "2023-05-15",
    amount: 5420.80,
    type: "income",
    category: "Sales",
    status: "completed",
    accountType: "client" // External client transaction
  },
  {
    id: "TX123457",
    description: "Office Supplies - Staples",
    date: "2023-05-14",
    amount: 231.50,
    type: "expense",
    category: "Office Expenses",
    status: "completed",
    accountType: "internal" // Internal firm transaction
  },
  {
    id: "TX123458",
    description: "Software Subscription - Adobe",
    date: "2023-05-12",
    amount: 79.99,
    type: "expense",
    category: "Software",
    status: "completed",
    accountType: "internal" // Internal firm transaction
  },
  {
    id: "TX123459",
    description: "Client Payment - XYZ Inc",
    date: "2023-05-10",
    amount: 3250.00,
    type: "income",
    category: "Sales",
    status: "completed",
    accountType: "client" // External client transaction
  },
  {
    id: "TX123460",
    description: "Marketing Services - Google Ads",
    date: "2023-05-08",
    amount: 450.00,
    type: "expense",
    category: "Marketing",
    status: "pending",
    accountType: "internal" // Internal firm transaction
  },
];

const TransactionsList = () => {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                Transaction
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                Category
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                Date
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                Amount
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                Status
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={cn(
                  "hover:bg-muted/50 transition-colors",
                  transaction.accountType === "client" ? "bg-green-50/30 dark:bg-green-950/10" : "bg-blue-50/30 dark:bg-blue-950/10"
                )}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3",
                        transaction.type === "income"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      )}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{transaction.description}</span>
                        {transaction.accountType === "client" ? (
                          <span className="ml-2">
                            <Users className="h-3.5 w-3.5 text-green-600" />
                          </span>
                        ) : (
                          <span className="ml-2">
                            <Building className="h-3.5 w-3.5 text-blue-600" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{transaction.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full bg-secondary",
                    transaction.accountType === "client" 
                      ? "border-green-200 dark:border-green-800 border" 
                      : "border-blue-200 dark:border-blue-800 border"
                  )}>
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span
                    className={cn(
                      "font-medium",
                      transaction.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {transaction.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span
                    className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      transaction.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                    )}
                  >
                    {transaction.status === "completed" ? "Completed" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsList;
