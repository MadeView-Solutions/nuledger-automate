
import React from "react";

interface ProcessingIndicatorProps {
  isProcessing: boolean;
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ isProcessing }) => {
  if (!isProcessing) return null;
  
  return (
    <div className="flex justify-center py-4">
      <div className="animate-pulse flex space-x-2">
        <div className="h-2 w-2 bg-primary rounded-full"></div>
        <div className="h-2 w-2 bg-primary rounded-full"></div>
        <div className="h-2 w-2 bg-primary rounded-full"></div>
      </div>
    </div>
  );
};

export default ProcessingIndicator;
