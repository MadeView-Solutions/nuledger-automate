
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { RiskScoreData } from "./types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskScoreCardProps {
  riskScoreData: RiskScoreData;
}

const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ riskScoreData }) => {
  const { overall, previousScore, categories } = riskScoreData;
  const scoreDifference = overall - previousScore;
  const isScoreImproved = scoreDifference > 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Security Risk Score</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1 bg-card">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-2 text-sm text-muted-foreground">Overall Score</div>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-24 h-24">
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    fill="none"
                    strokeWidth="8"
                    stroke="currentColor"
                    className="text-muted/20"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    fill="none"
                    strokeWidth="8"
                    stroke="currentColor"
                    strokeDasharray={36 * 2 * Math.PI}
                    strokeDashoffset={36 * 2 * Math.PI * (1 - overall / 100)}
                    className={
                      overall >= 80
                        ? "text-green-500"
                        : overall >= 60
                        ? "text-amber-500"
                        : "text-red-500"
                    }
                    strokeLinecap="round"
                    transform="rotate(-90 48 48)"
                  />
                </svg>
                <span className="absolute text-2xl font-bold">{overall}</span>
              </div>
              <div className="mt-2 flex items-center justify-center">
                {isScoreImproved ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm ${
                    isScoreImproved ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {Math.abs(scoreDifference)} points {isScoreImproved ? "up" : "down"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Transaction Security</span>
                  <span className="font-medium">{categories.transactionSecurity}</span>
                </div>
                <Progress
                  value={categories.transactionSecurity}
                  className={cn("h-2", getScoreColor(categories.transactionSecurity))}
                />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>User Authentication</span>
                  <span className="font-medium">{categories.userAuthentication}</span>
                </div>
                <Progress
                  value={categories.userAuthentication}
                  className={cn("h-2", getScoreColor(categories.userAuthentication))}
                />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Data Protection</span>
                  <span className="font-medium">{categories.dataProtection}</span>
                </div>
                <Progress
                  value={categories.dataProtection}
                  className={cn("h-2", getScoreColor(categories.dataProtection))}
                />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Vendor Risk</span>
                  <span className="font-medium">{categories.vendorRisk}</span>
                </div>
                <Progress
                  value={categories.vendorRisk}
                  className={cn("h-2", getScoreColor(categories.vendorRisk))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskScoreCard;
