
import React from "react";
import { Progress } from "@/components/ui/progress";

const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
        <div className="flex items-center space-x-2">
          <div className="text-sm">Thinking</div>
          <Progress className="w-16 h-2" value={90} />
        </div>
      </div>
    </div>
  );
};

export default ThinkingIndicator;
