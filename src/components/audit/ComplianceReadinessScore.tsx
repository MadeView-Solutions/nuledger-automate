
import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const complianceScores = [
  { category: "Financial Documentation", score: 92 },
  { category: "Tax Compliance", score: 87 },
  { category: "Business Entity", score: 100 },
  { category: "Employee Records", score: 78 },
  { category: "Regulatory Filings", score: 85 }
];

const ComplianceReadinessScore = () => {
  const overallScore = Math.round(
    complianceScores.reduce((sum, item) => sum + item.score, 0) / complianceScores.length
  );
  
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <CardTitle className="text-sm font-medium mb-4">Compliance Readiness</CardTitle>
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-muted stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              />
              <circle
                className="text-primary stroke-current"
                strokeWidth="8"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeDasharray={`${2.5 * Math.PI * 40}`}
                strokeDashoffset={`${2.5 * Math.PI * 40 * (1 - overallScore / 100)}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{overallScore}%</span>
              <span className="text-xs text-muted-foreground">Overall Score</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {complianceScores.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span>{item.category}</span>
                <span className="font-medium">{item.score}%</span>
              </div>
              <Progress value={item.score} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceReadinessScore;
