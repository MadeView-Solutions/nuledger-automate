
// Data for budget recommendations
export type Recommendation = {
  id: number;
  category: string;
  currentSpend: number;
  recommendedSpend: number;
  potentialSavings: number;
  impact: "low" | "medium" | "high";
  reasoning: string;
  status: "recommendation" | "opportunity" | "warning";
  icon: any;
};

import { TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

export const recommendations: Recommendation[] = [
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
