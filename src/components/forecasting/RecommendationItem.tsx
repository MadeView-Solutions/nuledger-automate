
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRightCircle, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
} from "lucide-react";
import { Recommendation } from "./data/recommendationsData";
import { getImpactColor, getStatusIcon } from "./utils/budgetUtils";

interface RecommendationItemProps {
  recommendation: Recommendation;
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({ recommendation }) => {
  const iconClassName = getStatusIcon(recommendation.status);
  const impactClassName = getImpactColor(recommendation.impact);
  
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-all">
      <div className="border-l-4 pl-4 py-4 pr-6" 
        style={{ borderLeftColor: `var(--${recommendation.status === 'warning' ? 'amber' : recommendation.status === 'opportunity' ? 'blue' : 'red'}-500)` }}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium">{recommendation.title}</h3>
              <div className={`text-xs px-2 py-0.5 rounded-full ${impactClassName}`}>
                {recommendation.impact.charAt(0).toUpperCase() + recommendation.impact.slice(1)} Impact
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{recommendation.description}</p>
            
            <div className="flex items-center gap-6 mt-3">
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className={recommendation.potentialSavings >= 0 ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}>
                  {recommendation.potentialSavings >= 0 
                    ? `Save $${recommendation.potentialSavings.toLocaleString()}`
                    : `Invest $${Math.abs(recommendation.potentialSavings).toLocaleString()}`}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{recommendation.implementationTimeframe}</span>
              </div>
            </div>
          </div>
          
          <div>
            {recommendation.status === 'recommendation' && (
              <AlertTriangle className={`h-5 w-5 ${iconClassName}`} />
            )}
            {recommendation.status === 'opportunity' && (
              <TrendingUp className={`h-5 w-5 ${iconClassName}`} />
            )}
            {recommendation.status === 'warning' && (
              <AlertTriangle className={`h-5 w-5 ${iconClassName}`} />
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-muted/30 px-4 py-2 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          Category: {recommendation.category.charAt(0).toUpperCase() + recommendation.category.slice(1)}
        </span>
        <Button variant="ghost" size="sm" className="text-xs">
          Take Action <ArrowRightCircle className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default RecommendationItem;
