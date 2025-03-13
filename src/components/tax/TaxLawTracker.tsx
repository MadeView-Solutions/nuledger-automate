
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Calendar, FileText, Info, TrendingUp, Zap } from "lucide-react";

const taxLawUpdates = [
  {
    id: "update-1",
    title: "Standard Deduction Increase",
    description: "Standard deduction for married couples filing jointly increased to $25,900 for tax year 2022.",
    date: "January 15, 2023",
    impact: "positive",
    category: "federal",
    relevance: "high"
  },
  {
    id: "update-2",
    title: "New Home Office Deduction Rules",
    description: "Simplified method for home office deduction calculation has been adjusted with new square footage rates.",
    date: "February 3, 2023",
    impact: "neutral",
    category: "federal",
    relevance: "medium"
  },
  {
    id: "update-3",
    title: "State Tax Rate Change",
    description: "California state tax rates adjusted for inflation with new brackets for high-income earners.",
    date: "March 12, 2023",
    impact: "negative",
    category: "state",
    relevance: "high"
  },
  {
    id: "update-4",
    title: "Electric Vehicle Tax Credit",
    description: "New qualifications for electric vehicle tax credits under the Inflation Reduction Act.",
    date: "April 5, 2023",
    impact: "positive",
    category: "federal",
    relevance: "medium"
  },
  {
    id: "update-5",
    title: "Retirement Contribution Limits",
    description: "401(k) contribution limits increased to $22,500 for 2023 tax year.",
    date: "May 22, 2023",
    impact: "positive",
    category: "federal",
    relevance: "high"
  }
];

const TaxLawTracker = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          AI Tax Law Tracker
          <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-950">
            <Brain className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          Real-time tracking of tax law changes and their impact on your financial situation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {taxLawUpdates.map((update) => (
            <div key={update.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">{update.title}</h3>
                    {update.impact === "positive" && (
                      <Badge className="ml-2 bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Beneficial
                      </Badge>
                    )}
                    {update.impact === "negative" && (
                      <Badge className="ml-2 bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                        Impact Alert
                      </Badge>
                    )}
                    {update.impact === "neutral" && (
                      <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                        <Info className="h-3 w-3 mr-1" />
                        Informational
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1">{update.description}</p>
                  <div className="flex items-center mt-3 space-x-4 text-sm">
                    <span className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {update.date}
                    </span>
                    <Badge variant="outline">
                      {update.category === "federal" ? "Federal" : "State"}
                    </Badge>
                    {update.relevance === "high" && (
                      <span className="flex items-center text-amber-600 dark:text-amber-400">
                        <Zap className="h-4 w-4 mr-1" />
                        High Relevance
                      </span>
                    )}
                  </div>
                </div>
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center mb-2">
            <Brain className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-medium">AI Tax Insight</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on recent tax law changes, you may qualify for an additional $3,200 in deductions this year. 
            Consider adjusting your retirement contributions to maximize tax benefits under the new limits.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxLawTracker;
