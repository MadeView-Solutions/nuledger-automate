
import React from "react";
import { Progress } from "@/components/ui/progress";
import { RefreshCw } from "lucide-react";

interface ProcessingProgressProps {
  isUploading: boolean;
  uploadProgress: number;
  processingProgress: number;
}

const ProcessingProgress: React.FC<ProcessingProgressProps> = ({
  isUploading,
  uploadProgress,
  processingProgress
}) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">
        {isUploading ? "Uploading File" : "AI Processing"}
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{isUploading ? "Upload Progress" : "AI Analysis Progress"}</span>
          <span>{isUploading ? uploadProgress : processingProgress}%</span>
        </div>
        <Progress value={isUploading ? uploadProgress : processingProgress} />
      </div>
      <p className="text-sm text-muted-foreground">
        {isUploading 
          ? "Uploading your Excel file to the cloud..." 
          : "AI is analyzing formulas, finding errors, and generating insights..."}
      </p>
    </div>
  );
};

export default ProcessingProgress;
