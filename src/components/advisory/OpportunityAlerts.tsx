
import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, DollarSign, ShieldCheck } from "lucide-react";

const opportunities = [
  {
    id: 1,
    title: "Tax Savings Opportunity",
    description: "R&D tax credit eligibility detected based on recent expenses",
    impact: "Estimated $14,500 savings",
    type: "tax",
    priority: "high"
  },
  {
    id: 2,
    title: "Investment Opportunity",
    description: "Cash reserves exceeding operational needs by 35%",
    impact: "Potential 4.2% yield increase",
    type: "investment",
    priority: "medium"
  },
  {
    id: 3,
    title: "Cost Reduction",
    description: "SaaS spending analysis shows 3 redundant services",
    impact: "Save $8,200 annually",
    type: "cost",
    priority: "medium"
  },
  {
    id: 4,
    title: "Industry Benchmark Alert",
    description: "Marketing ROI is 18% below industry peers",
    impact: "Growth opportunity",
    type: "benchmark",
    priority: "low"
  }
];

const OpportunityAlerts = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-sm font-medium">Opportunity Alerts</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">View All</Button>
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {opportunities.map(opportunity => (
            <div key={opportunity.id} className="bg-muted/30 border border-border rounded-lg p-3">
              <div className="flex items-start space-x-3">
                <OpportunityIcon type={opportunity.type} />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{opportunity.title}</h3>
                    <PriorityBadge priority={opportunity.priority} />
                  </div>
                  <p className="text-xs text-muted-foreground">{opportunity.description}</p>
                  <div className="text-xs font-medium text-primary">{opportunity.impact}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface OpportunityIconProps {
  type: string;
}

const OpportunityIcon: React.FC<OpportunityIconProps> = ({ type }) => {
  switch (type) {
    case "tax":
      return (
        <div className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 p-2 rounded-full">
          <DollarSign className="h-4 w-4" />
        </div>
      );
    case "investment":
      return (
        <div className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 p-2 rounded-full">
          <TrendingUp className="h-4 w-4" />
        </div>
      );
    case "cost":
      return (
        <div className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 p-2 rounded-full">
          <DollarSign className="h-4 w-4" />
        </div>
      );
    case "benchmark":
      return (
        <div className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 p-2 rounded-full">
          <ShieldCheck className="h-4 w-4" />
        </div>
      );
    default:
      return (
        <div className="bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 p-2 rounded-full">
          <Lightbulb className="h-4 w-4" />
        </div>
      );
  }
};

interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">High</Badge>;
    case "medium":
      return <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">Medium</Badge>;
    case "low":
      return <Badge className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Low</Badge>;
    default:
      return <Badge>Normal</Badge>;
  }
};

export default OpportunityAlerts;
