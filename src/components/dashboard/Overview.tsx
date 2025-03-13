
import React from "react";
import { BarChart3, ArrowUp, ArrowDown, DollarSign, CreditCard, TrendingUp, RefreshCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router-dom";

const metrics = [
  {
    title: "Total Revenue",
    value: "$48,574.21",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    title: "Expenses",
    value: "$15,246.80",
    change: "-3.2%",
    trend: "down",
    icon: CreditCard,
    color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  },
  {
    title: "Net Profit",
    value: "$33,327.41",
    change: "+18.7%",
    trend: "up",
    icon: TrendingUp,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    title: "Total Invoices",
    value: "248",
    change: "+8.4%",
    trend: "up",
    icon: BarChart3,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  },
];

const Overview = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {metric.title}
              </p>
              <h3 className="text-2xl font-bold text-foreground">{metric.value}</h3>
              <div className="flex items-center mt-2">
                {metric.trend === "up" ? (
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    metric.trend === "up" ? "text-green-500" : "text-red-500"
                  )}
                >
                  {metric.change}
                </span>
              </div>
            </div>
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                metric.color
              )}
            >
              <metric.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Reconciliation Status
          </CardTitle>
          <RefreshCcw className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">42</div>
          <p className="text-xs text-muted-foreground">
            Transactions awaiting reconciliation
          </p>
          <div className="mt-3">
            <NavLink 
              to="/bank-reconciliation"
              className="text-xs text-primary flex items-center"
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              Run AI reconciliation
            </NavLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
