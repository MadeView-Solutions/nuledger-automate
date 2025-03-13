
import React from "react";
import { Badge } from "@/components/ui/badge";
import { GeneratedFormula } from "./types";

interface HistoryListProps {
  history: GeneratedFormula[];
  setGeneratedFormula: (formula: GeneratedFormula) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, setGeneratedFormula }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="font-medium text-sm mb-2">Recent Formulas</h4>
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 cursor-pointer"
            onClick={() => setGeneratedFormula(item)}
          >
            <div>
              <p className="text-sm font-medium">{item.prompt}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                {item.formula}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {item.type.toUpperCase()}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
