
import React from "react";
import { Button } from "@/components/ui/button";
import { Brain, Download, Eye, Send } from "lucide-react";

interface FormActionsProps {
  formName: string;
  completed: boolean;
  onGenerateForm: (formName: string) => void;
  onFileForm: (formName: string) => void;
}

export const FormActions: React.FC<FormActionsProps> = ({ 
  formName, 
  completed, 
  onGenerateForm, 
  onFileForm 
}) => {
  return (
    <div className="flex space-x-1">
      {completed ? (
        <>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => onFileForm(formName)}
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onGenerateForm(formName)}
        >
          <Brain className="h-4 w-4 mr-2" />
          Generate
        </Button>
      )}
    </div>
  );
};
