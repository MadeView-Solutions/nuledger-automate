
import React, { useState } from "react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { taxForms } from "./taxFormsData";
import { FormTableRow } from "./FormTableRow";
import IRSDataImporter from "./IRSDataImporter";

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
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Tax Forms</CardTitle>
            <CardDescription>
              AI-powered form generation and e-filing system
            </CardDescription>
          </div>
          <IRSDataImporter 
            onImportStart={handleImportIRSData} 
            onImportComplete={handleImportComplete} 
            isImporting={isImporting}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taxForms.map((form) => (
              <FormTableRow 
                key={form.id}
                form={form}
                onGenerateForm={handleGenerateForm}
                onFileForm={handleFileForm}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TaxForms;
