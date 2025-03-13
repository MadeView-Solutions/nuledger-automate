
import React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Code2 } from "lucide-react";

const FormulaGeneratorHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calculator className="h-5 w-5" />
        AI Formula Generator & Excel Integration
        <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-950">
          <Code2 className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </CardTitle>
      <CardDescription>
        Generate formulas, reports, and financial insights using natural language - now with Excel and Cloud AI integration
      </CardDescription>
    </CardHeader>
  );
};

export default FormulaGeneratorHeader;
