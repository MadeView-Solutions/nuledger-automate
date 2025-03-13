
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Invoice } from "@/types/invoice";
import InvoiceListItem from "./InvoiceListItem";

interface InvoiceTableProps {
  invoices: Invoice[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <InvoiceListItem key={invoice.id} invoice={invoice} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTable;
