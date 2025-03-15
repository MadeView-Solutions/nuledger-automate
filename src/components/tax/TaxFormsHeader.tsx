
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import IRSDataImporter from "./IRSDataImporter";

interface TaxFormsHeaderProps {
  onImportStart: (clientId: string) => void;
  onImportComplete: (success: boolean, formCount: number) => void;
  isImporting: boolean;
}

const TaxFormsHeader: React.FC<TaxFormsHeaderProps> = ({
  onImportStart,
  onImportComplete,
  isImporting
}) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <CardTitle>Tax Forms</CardTitle>
        <CardDescription>
          AI-powered form generation and e-filing system
        </CardDescription>
      </div>
      <IRSDataImporter 
        onImportStart={onImportStart} 
        onImportComplete={onImportComplete} 
        isImporting={isImporting}
      />
    </div>
  );
};

export default TaxFormsHeader;
