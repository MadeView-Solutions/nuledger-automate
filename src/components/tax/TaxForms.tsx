
import React, { useState } from "react";
import { 
  Card, 
  CardContent,
  CardHeader
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { taxForms } from "./taxFormsData";
import TaxFormsHeader from "./TaxFormsHeader";
import TaxFormsTable from "./TaxFormsTable";

const TaxForms = () => {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  
  const handleGenerateForm = (formId: string) => {
    toast({
      title: "Generating Form",
      description: `AI is now auto-filling ${formId} with your financial data`,
    });
  };
  
  const handleFileForm = (formId: string) => {
    toast({
      title: "Form Filed Successfully",
      description: `${formId} has been electronically filed with the appropriate agency`,
    });
  };

  const handleImportIRSData = (clientId: string) => {
    setIsImporting(true);
  };

  const handleImportComplete = (success: boolean, formCount: number) => {
    setIsImporting(false);
    if (success) {
      toast({
        title: "IRS Data Import Complete",
        description: `Successfully imported data for ${formCount} tax forms`,
      });
    } else {
      toast({
        title: "Import Failed",
        description: "Could not retrieve data from the IRS. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <TaxFormsHeader
          onImportStart={handleImportIRSData}
          onImportComplete={handleImportComplete}
          isImporting={isImporting}
        />
      </CardHeader>
      <CardContent>
        <TaxFormsTable 
          taxForms={taxForms}
          onGenerateForm={handleGenerateForm}
          onFileForm={handleFileForm}
        />
      </CardContent>
    </Card>
  );
};

export default TaxForms;
