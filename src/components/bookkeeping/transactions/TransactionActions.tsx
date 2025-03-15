
import React from "react";
import { Button } from "@/components/ui/button";
import { Dices, Upload, Download } from "lucide-react";

interface TransactionActionsProps {
  onRunAI: () => void;
  onImport: () => void;
  onExport: () => void;
}

const TransactionActions = ({ onRunAI, onImport, onExport }: TransactionActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={onImport}>
        <Upload className="mr-2 h-4 w-4" />
        Import
      </Button>
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button variant="default" size="sm" onClick={onRunAI}>
        <Dices className="mr-2 h-4 w-4" />
        Run AI
      </Button>
    </div>
  );
};

export default TransactionActions;
