
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, List } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

interface IRSDataImportButtonsProps {
  onImportClick: () => void;
  onAvailableFormsClick: () => void;
}

const IRSDataImportButtons: React.FC<IRSDataImportButtonsProps> = ({
  onImportClick,
  onAvailableFormsClick
}) => {
  return (
    <div className="flex gap-2">
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={onImportClick}>
          <Download className="h-4 w-4 mr-2" />
          Import IRS Data
        </Button>
      </DialogTrigger>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={onAvailableFormsClick}>
          <List className="h-4 w-4 mr-2" />
          Available Forms
        </Button>
      </DialogTrigger>
    </div>
  );
};

export default IRSDataImportButtons;
