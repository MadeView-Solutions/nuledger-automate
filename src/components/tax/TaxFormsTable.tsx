
import React from "react";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FormTableRow } from "./FormTableRow";
import { TaxForm } from "./types";

interface TaxFormsTableProps {
  taxForms: TaxForm[];
  onGenerateForm: (formId: string) => void;
  onFileForm: (formId: string) => void;
}

const TaxFormsTable: React.FC<TaxFormsTableProps> = ({
  taxForms,
  onGenerateForm,
  onFileForm
}) => {
  return (
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
            onGenerateForm={onGenerateForm}
            onFileForm={onFileForm}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default TaxFormsTable;
