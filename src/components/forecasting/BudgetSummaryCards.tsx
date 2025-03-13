
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Zap } from "lucide-react";
import { recommendations } from "./data/recommendationsData";
import { calculateTotalSavings, calculateTotalOpportunities } from "./utils/budgetUtils";

const BudgetSummaryCards: React.FC = () => {
  // Calculate total potential savings
  const totalPotentialSavings = calculateTotalSavings(recommendations);
  
  // Calculate total potential opportunities
  const totalOpportunities = calculateTotalOpportunities(recommendations);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <div className="mr-2 p-2 rounded-full bg-green-100 dark:bg-green-900/20">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            Potential Cost Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold">${totalPotentialSavings.toLocaleString()}</span>
            <span className="text-muted-foreground">per month</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            AI has identified several areas where costs could be reduced without impacting operations
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <div className="mr-2 p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Growth Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold">${totalOpportunities.toLocaleString()}</span>
            <span className="text-muted-foreground">potential investment</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Strategic investments that could drive growth and increase long-term profitability
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummaryCards;
