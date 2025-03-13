
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Settings } from "lucide-react";

const ReceiptProcessorHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold">AI Receipt & Invoice Processor</h1>
        <p className="text-muted-foreground mt-1">
          Automatically extract financial data from receipts, invoices, and statements
        </p>
      </div>
      <div className="flex space-x-3">
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Processing Settings
        </Button>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Batch Upload
        </Button>
      </div>
    </div>
  );
};

export default ReceiptProcessorHeader;
