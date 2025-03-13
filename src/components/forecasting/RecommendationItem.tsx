
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { Recommendation } from "./data/recommendationsData";
import { getImpactColor } from "./utils/budgetUtils";

interface RecommendationItemProps {
  recommendation: Recommendation;
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({ recommendation }) => {
  const getStatusIcon = (status: string) => {
    if (status === "recommendation") {
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    } else if (status === "opportunity") {
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    } else if (status === "warning") {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
    return <Check className="h-5 w-5 text-blue-500" />;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted mr-3">
            {getStatusIcon(recommendation.status)}
          </div>
          <span className="font-medium">{recommendation.category}</span>
        </div>
        <Badge 
          variant="secondary" 
          className={getImpactColor(recommendation.impact)}
        >
          {recommendation.impact === "high" ? "High Impact" : recommendation.impact === "medium" ? "Medium Impact" : "Low Impact"}
        </Badge>
      </div>
      
      <div className="pl-11">
        <div className="grid grid-cols-3 gap-2 text-sm mb-2">
          <div>
            <div className="text-muted-foreground">Current</div>
            <div className="font-medium">${recommendation.currentSpend.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Recommended</div>
            <div className="font-medium">${recommendation.recommendedSpend.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">
              {recommendation.potentialSavings > 0 ? "Savings" : "Investment"}
            </div>
            <div className={`font-medium ${recommendation.potentialSavings > 0 ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`}>
              ${Math.abs(recommendation.potentialSavings).toLocaleString()}
            </div>
          </div>
        </div>
        
        <Progress 
          value={(recommendation.recommendedSpend / recommendation.currentSpend) * 100} 
          className={`h-2 ${recommendation.potentialSavings > 0 ? "bg-red-100 dark:bg-red-900/20" : "bg-blue-100 dark:bg-blue-900/20"}`}
        />
        
        <p className="text-sm text-muted-foreground mt-2">
          {recommendation.reasoning}
        </p>
      </div>
    </div>
  );
};

export default RecommendationItem;
