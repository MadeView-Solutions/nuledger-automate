
import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, Wallet, DollarSign, AlertCircle } from "lucide-react";

const stats = [
  {
    title: "Projected Revenue (30 days)",
    value: "$47,850.00",
    change: "+12% from last month",
    icon: TrendingUp,
    color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    title: "Projected Expenses",
    value: "$32,150.00",
    change: "+5% from last month",
    icon: Wallet,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  },
  {
    title: "Projected Cash Flow",
    value: "$15,700.00",
    change: "+24% from last month",
    icon: DollarSign,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    title: "Cash Flow Risk",
    value: "Low",
    change: "No immediate concerns",
    icon: AlertCircle,
    color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
];

const ForecastStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <div className="mt-2">
                <span className="text-sm text-muted-foreground">
                  {stat.change}
                </span>
              </div>
            </div>
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                stat.color
              )}
            >
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForecastStats;
