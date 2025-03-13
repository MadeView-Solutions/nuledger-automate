
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import { recommendations } from "./data/recommendationsData";
import BudgetSummaryCards from "./BudgetSummaryCards";
import RecommendationItem from "./RecommendationItem";

const BudgetRecommendations = () => {
  return (
    <div className="space-y-8">
      <BudgetSummaryCards />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            AI Budget Recommendations
            <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-950">
              <Brain className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </CardTitle>
          <CardDescription>
            Smart budgeting recommendations based on spending patterns and financial goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recommendations.map((recommendation) => (
              <RecommendationItem 
                key={recommendation.id} 
                recommendation={recommendation} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetRecommendations;
