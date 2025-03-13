
import { Recommendation } from "../data/recommendationsData";

// Get color based on impact level
export const getImpactColor = (impact: string) => {
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

// Get icon based on status
export const getStatusIcon = (status: string) => {
  switch (status) {
    case "recommendation":
      return "text-red-500";
    case "opportunity": 
      return "text-green-500";
    case "warning":
      return "text-amber-500";
    default:
      return "text-blue-500";
  }
};

// Calculate total potential savings
export const calculateTotalSavings = (recommendations: Recommendation[]) => {
  return recommendations
    .filter(rec => rec.potentialSavings > 0)
    .reduce((sum, rec) => sum + rec.potentialSavings, 0);
};

// Calculate total potential opportunities
export const calculateTotalOpportunities = (recommendations: Recommendation[]) => {
  return recommendations
    .filter(rec => rec.potentialSavings < 0)
    .reduce((sum, rec) => sum + Math.abs(rec.potentialSavings), 0);
};
