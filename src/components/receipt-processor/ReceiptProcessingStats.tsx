
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Clock, CheckCircle, AlertCircle } from "lucide-react";

const ReceiptProcessingStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Processed This Month" 
        value="182" 
        change="+24%" 
        icon={<CheckCircle className="h-4 w-4 text-green-500" />} 
      />
      <StatCard 
        title="Processing Time" 
        value="8.4s" 
        change="-2.1s" 
        icon={<Clock className="h-4 w-4 text-blue-500" />} 
      />
      <StatCard 
        title="Accuracy Rate" 
        value="97.8%" 
        change="+1.2%" 
        icon={<ArrowUpRight className="h-4 w-4 text-green-500" />} 
      />
      <StatCard 
        title="Requires Review" 
        value="12" 
        change="-8" 
        icon={<AlertCircle className="h-4 w-4 text-amber-500" />} 
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon}
        </div>
        <div className="flex items-baseline">
          <h3 className="text-2xl font-bold">{value}</h3>
          <span className={`ml-2 text-xs font-medium ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptProcessingStats;
