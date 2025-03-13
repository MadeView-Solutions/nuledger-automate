
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import { TaxForm } from "./types";
import { FormStatusDisplay } from "./FormStatusDisplay";
import { FormActions } from "./FormActions";

interface FormTableRowProps {
  form: TaxForm;
  onGenerateForm: (formName: string) => void;
  onFileForm: (formName: string) => void;
}

export const FormTableRow: React.FC<FormTableRowProps> = ({ 
  form, 
  onGenerateForm,
  onFileForm 
}) => {
  return (
    <TableRow key={form.id}>
      <TableCell>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{form.name}</span>
          {form.aiGenerated && (
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950">
              <Brain className="h-3 w-3 mr-1" />
              AI
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>{form.description}</TableCell>
      <TableCell>{form.dueDate}</TableCell>
      <TableCell>
        <FormStatusDisplay status={form.status} />
      </TableCell>
      <TableCell>
        <FormActions 
          formName={form.name}
          completed={form.completed}
          onGenerateForm={onGenerateForm}
          onFileForm={onFileForm}
        />
      </TableCell>
    </TableRow>
  );
};
