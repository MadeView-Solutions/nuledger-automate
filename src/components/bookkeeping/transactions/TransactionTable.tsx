
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Transaction, transactionCategories } from "./TransactionTypes";
import TransactionStatusBadge from "./TransactionStatusBadge";

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {new Date(transaction.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div>
                  <div>{transaction.description}</div>
                  <div className="text-xs text-muted-foreground">{transaction.id}</div>
                </div>
              </TableCell>
              <TableCell>
                <select 
                  defaultValue={transaction.category}
                  className="min-w-32 border border-input bg-background text-sm rounded-md px-3 py-1"
                >
                  {transactionCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </TableCell>
              <TableCell className="text-right">
                ${transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <TransactionStatusBadge 
                  status={transaction.status}
                  confidence={transaction.confidence}
                />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
