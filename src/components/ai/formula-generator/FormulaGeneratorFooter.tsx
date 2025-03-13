
import React from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const FormulaGeneratorFooter: React.FC = () => {
  return (
    <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
      <div className="flex items-center text-xs text-muted-foreground">
        <AlertCircle className="h-3 w-3 mr-1" />
        AI features powered by OpenAI, Pandas, and Power BI integration
      </div>
      <Button variant="outline" size="sm">
        View Documentation
      </Button>
    </CardFooter>
  );
};

export default FormulaGeneratorFooter;
