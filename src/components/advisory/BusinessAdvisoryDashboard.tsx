
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Briefcase, 
  AlertTriangle, 
  Brain,
  LineChart,
  Target,
  Lightbulb,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BusinessHealthIndicators from "./BusinessHealthIndicators";
import OpportunityAlerts from "./OpportunityAlerts";

const BusinessAdvisoryDashboard = () => {
  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-xl">
                Strategic Business Advisory
                <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-950">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </CardTitle>
              <CardDescription>
                Data-driven insights and strategic recommendations for your business growth
              </CardDescription>
            </div>
            <Button>
              Generate Strategy Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BusinessHealthIndicators />
            </div>
            <div>
              <OpportunityAlerts />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <MetricCard
              title="Growth Potential"
              value="High"
              trend="+15% projected"
              icon={TrendingUp}
              color="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            />
            <MetricCard
              title="Cash Flow Risk"
              value="Medium"
              trend="Improving trend"
              icon={AlertTriangle}
              color="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
            />
            <MetricCard
              title="Market Position"
              value="Strong"
              trend="Top quartile in sector"
              icon={Briefcase}
              color="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <StrategyCard 
              title="Cash Flow Optimization"
              description="Implement accounts receivable automation to improve collection by 23%"
              icon={LineChart}
              priority="High"
            />
            <StrategyCard 
              title="Strategic Investment"
              description="Consider equipment upgrade to reduce maintenance costs by estimated 31%"
              icon={Target}
              priority="Medium"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ElementType;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon: Icon, color }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-xl font-bold">{value}</h3>
          <div className="mt-2">
            <span className="text-sm text-muted-foreground">{trend}</span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

interface StrategyCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  priority: "High" | "Medium" | "Low";
}

const StrategyCard: React.FC<StrategyCardProps> = ({ title, description, icon: Icon, priority }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case "High": return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "Medium": return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
      case "Low": return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      default: return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };
  
  return (
    <div className="bg-muted/30 border border-border rounded-xl p-5">
      <div className="flex items-start space-x-4">
        <div className="bg-background border border-border rounded-full p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium">{title}</h3>
            <Badge className={getPriorityColor()}>{priority} Priority</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Button variant="link" className="px-0 mt-2" size="sm">
            View detailed analysis
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessAdvisoryDashboard;
