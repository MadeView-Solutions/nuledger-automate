
import React from "react";
import { cn } from "@/lib/utils";
import { FileClock, FileCheck, CreditCard, BellRing } from "lucide-react";

const stats = [
  {
    title: "Pending Invoices",
    value: "24",
    change: "+4 this week",
    icon: FileClock,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  },
  {
    title: "Paid Invoices",
    value: "142",
    change: "+18 this month",
    icon: FileCheck,
    color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    title: "Total Receivables",
    value: "$45,256.89",
    change: "-$2,150 since last week",
    icon: CreditCard,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    title: "Due Reminders",
    value: "8",
    change: "3 overdue",
    icon: BellRing,
    color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  },
];

const InvoiceStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

export default InvoiceStats;
