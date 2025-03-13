
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { invoices } from "@/data/mockInvoices";
import InvoiceSearchBar from "./InvoiceSearchBar";
import InvoiceTable from "./InvoiceTable";

const InvoiceManager = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = invoices.filter(invoice => 
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Invoice Management</CardTitle>
        <CardDescription>
          AI-powered invoice generation, tracking, and reconciliation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <InvoiceSearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
          <InvoiceTable invoices={filteredInvoices} />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="text-sm text-muted-foreground">
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </div>
      </CardFooter>
    </Card>
  );
};

export default InvoiceManager;
