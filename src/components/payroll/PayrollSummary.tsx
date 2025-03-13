
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DollarSign, Users, CalendarClock, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Next Payroll Amount",
    value: "$48,250.00",
    change: "Due in 8 days",
    icon: DollarSign,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    title: "Active Employees",
    value: "36",
    change: "+2 from last month",
    icon: Users,
    color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    title: "Hours Tracked",
    value: "1,248",
    change: "This pay period",
    icon: CalendarClock,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  },
  {
    title: "Projected YTD",
    value: "$1.2M",
    change: "+5.4% from last year",
    icon: TrendingUp,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  },
];

const PayrollSummary = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PayrollSummary;
