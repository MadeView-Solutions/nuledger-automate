
import React from "react";
import { cn } from "@/lib/utils";
import { User, Receipt, Calendar, AlertCircle, Bell, FileText, CreditCard } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "New invoice created",
    description: "Invoice #INV-2023-051 for ABC Corp has been created",
    time: "2 hours ago",
    icon: FileText,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    id: 2,
    title: "Payment received",
    description: "Payment of $3,450.00 received from XYZ Inc",
    time: "4 hours ago",
    icon: CreditCard,
    color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    id: 3,
    title: "Tax filing reminder",
    description: "Quarterly tax filing is due in 15 days",
    time: "8 hours ago",
    icon: Calendar,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  },
  {
    id: 4,
    title: "New client added",
    description: "Client 'Global Tech Solutions' has been added",
    time: "1 day ago",
    icon: User,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    id: 5,
    title: "Expense approval needed",
    description: "New expense of $580.50 requires your approval",
    time: "1 day ago",
    icon: AlertCircle,
    color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  },
];

const RecentActivity = () => {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <div className="flex items-center space-x-2">
          <button className="relative p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex">
              <div
                className={cn(
                  "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-4",
                  activity.color
                )}
              >
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
