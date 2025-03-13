
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Shield } from "lucide-react";

const SecurityMeasuresHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <CardTitle className="flex items-center">
          Security & Compliance Measures
          <Badge variant="outline" className="ml-2 bg-green-50 dark:bg-green-950">
            <Shield className="h-3 w-3 mr-1" />
            Enterprise-Grade
          </Badge>
        </CardTitle>
        <CardDescription>
          Comprehensive protection for your sensitive financial data
        </CardDescription>
      </div>
    </div>
  );
};

export default SecurityMeasuresHeader;
