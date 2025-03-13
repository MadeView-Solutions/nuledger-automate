
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Send, FileText, Brain } from "lucide-react";
import { Invoice } from "@/types/invoice";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

interface InvoiceListItemProps {
  invoice: Invoice;
}

const InvoiceListItem: React.FC<InvoiceListItemProps> = ({ invoice }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center">
          {invoice.id}
          {invoice.aiGenerated && (
            <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-950">
              <Brain className="h-3 w-3 mr-1" />
              AI
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>{invoice.client}</TableCell>
      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
      <TableCell className="text-right">
        ${invoice.amount.toFixed(2)}
      </TableCell>
      <TableCell>
        <InvoiceStatusBadge status={invoice.status} />
      </TableCell>
      <TableCell>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Send className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default InvoiceListItem;
