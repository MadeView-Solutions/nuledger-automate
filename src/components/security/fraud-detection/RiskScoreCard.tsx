
import React from "react";
import { Badge } from "@/components/ui/badge";
import { RiskScoreData } from "./types";

interface RiskScoreCardProps {
  riskScoreData: RiskScoreData;
}

const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ riskScoreData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-card border rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium">Overall Risk Score</h3>
          <Badge
            className={
              riskScoreData.overall > 80
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : riskScoreData.overall > 50
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            }
          >
            {riskScoreData.overall}/100
          </Badge>
        </div>
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
            <div
              style={{ width: `${riskScoreData.overall}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 dark:bg-green-400"
            ></div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          <span className="text-green-600 dark:text-green-400">
            ↑ {riskScoreData.overall - riskScoreData.previousScore}%
          </span>{" "}
          improvement from previous assessment
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(riskScoreData.categories).map(([key, value]) => (
          <div key={key} className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">{value}%</p>
              <div
                className={`h-2 w-2 rounded-full ${
                  value > 80
                    ? "bg-green-500"
                    : value > 50
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskScoreCard;
