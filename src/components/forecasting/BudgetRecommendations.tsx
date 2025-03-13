
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingDown, TrendingUp, AlertTriangle, Check, Zap, DollarSign } from "lucide-react";

const recommendations = [
  {
    id: 1,
    category: "Office Supplies",
    currentSpend: 2500,
    recommendedSpend: 1800,
    potentialSavings: 700,
    impact: "low",
    reasoning: "Based on your usage patterns, you're overspending on office supplies by approximately 28%. AI suggests implementing better inventory management.",
    status: "recommendation",
    icon: TrendingDown,
  },
  {
    id: 2,
    category: "Marketing",
    currentSpend: 8500,
    recommendedSpend: 10000,
    potentialSavings: -1500,
    impact: "high",
    reasoning: "Your marketing ROI analysis suggests increasing budget by 18% could generate 30% more leads based on current conversion rates.",
    status: "opportunity",
    icon: TrendingUp,
  },
  {
    id: 3,
    category: "Software Subscriptions",
    currentSpend: 4200,
    recommendedSpend: 3600,
    potentialSavings: 600,
    impact: "medium",
    reasoning: "AI detected 3 redundant SaaS tools and 2 underutilized subscriptions that could be consolidated or downgraded.",
    status: "recommendation",
    icon: TrendingDown,
  },
  {
    id: 4,
    category: "Utilities",
    currentSpend: 3200,
    recommendedSpend: 2800,
    potentialSavings: 400,
    impact: "medium",
    reasoning: "Energy usage patterns suggest potential savings by optimizing HVAC schedules and switching to energy-efficient appliances.",
    status: "recommendation",
    icon: TrendingDown,
  },
  {
    id: 5,
    category: "Staff Training",
    currentSpend: 1500,
    recommendedSpend: 2500,
    potentialSavings: -1000,
    impact: "high",
    reasoning: "Increased investment in staff training could reduce turnover by an estimated 15% based on industry benchmarks.",
    status: "opportunity",
    icon: TrendingUp,
  },
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "high":
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
    case "medium":
      return "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/20";
    case "low":
      return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20";
    default:
      return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
  }
};

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

const BudgetRecommendations = () => {
  // Calculate total potential savings
  const totalPotentialSavings = recommendations
    .filter(rec => rec.potentialSavings > 0)
    .reduce((sum, rec) => sum + rec.potentialSavings, 0);
  
  // Calculate total potential opportunities
  const totalOpportunities = recommendations
    .filter(rec => rec.potentialSavings < 0)
    .reduce((sum, rec) => sum + Math.abs(rec.potentialSavings), 0);
  
  return (
    <div className="space-y-8">
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
            {recommendations.map((rec) => (
              <div key={rec.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted mr-3">
                      {getStatusIcon(rec.status)}
                    </div>
                    <span className="font-medium">{rec.category}</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={getImpactColor(rec.impact)}
                  >
                    {rec.impact === "high" ? "High Impact" : rec.impact === "medium" ? "Medium Impact" : "Low Impact"}
                  </Badge>
                </div>
                
                <div className="pl-11">
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <div>
                      <div className="text-muted-foreground">Current</div>
                      <div className="font-medium">${rec.currentSpend.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Recommended</div>
                      <div className="font-medium">${rec.recommendedSpend.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">
                        {rec.potentialSavings > 0 ? "Savings" : "Investment"}
                      </div>
                      <div className={`font-medium ${rec.potentialSavings > 0 ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`}>
                        ${Math.abs(rec.potentialSavings).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={(rec.recommendedSpend / rec.currentSpend) * 100} 
                    className={`h-2 ${rec.potentialSavings > 0 ? "bg-red-100 dark:bg-red-900/20" : "bg-blue-100 dark:bg-blue-900/20"}`}
                  />
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    {rec.reasoning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetRecommendations;
