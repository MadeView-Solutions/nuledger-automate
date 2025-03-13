
import React from "react";
import { CheckCircle2, Clock, FileWarning } from "lucide-react";
import { TaxFormStatus } from "./types";

interface FormStatusDisplayProps {
  status: TaxFormStatus;
}

export const FormStatusDisplay: React.FC<FormStatusDisplayProps> = ({ status }) => {
  const getStatusIcon = (status: TaxFormStatus) => {
    switch (status) {
      case "ready":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "not-started":
        return <FileWarning className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: TaxFormStatus) => {
    switch (status) {
      case "ready":
        return "Ready to File";
      case "in-progress":
        return "In Progress";
      case "not-started":
        return "Not Started";
      default:
        return status;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {getStatusIcon(status)}
      <span>{getStatusText(status)}</span>
    </div>
  );
};
