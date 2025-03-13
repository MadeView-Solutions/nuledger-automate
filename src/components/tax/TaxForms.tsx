
import React from "react";
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

const TaxForms = () => {
  const { toast } = useToast();
  
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Forms</CardTitle>
        <CardDescription>
          AI-powered form generation and e-filing system
        </CardDescription>
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
