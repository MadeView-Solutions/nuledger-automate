
import React from "react";
import { Button } from "@/components/ui/button";
import { FileCheck, Upload, Settings } from "lucide-react";

const TaxComplianceHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold">AI-Driven Tax Compliance & Filing</h1>
        <p className="text-muted-foreground mt-1">
          Automated tax preparation, filing, and compliance monitoring
        </p>
      </div>
      <div className="flex space-x-3">
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Tax Settings
        </Button>
        <Button>
          <FileCheck className="h-4 w-4 mr-2" />
          Start New Filing
        </Button>
      </div>
    </div>
  );
};

export default TaxComplianceHeader;
