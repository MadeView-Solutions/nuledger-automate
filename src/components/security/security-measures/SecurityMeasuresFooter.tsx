
import React from "react";
import { Shield } from "lucide-react";

const SecurityMeasuresFooter: React.FC = () => {
  return (
    <div className="text-sm text-muted-foreground">
      <Shield className="h-4 w-4 mr-2 inline-block" />
      Enterprise-grade security and compliance measures protecting your financial data
    </div>
  );
};

export default SecurityMeasuresFooter;
