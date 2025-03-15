
import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  ResponsiveContainer, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from "recharts";

const data = [
  { month: 'Jan', profitMargin: 12, industryAvg: 10, cashReserve: 8 },
  { month: 'Feb', profitMargin: 14, industryAvg: 10.2, cashReserve: 9 },
  { month: 'Mar', profitMargin: 16, industryAvg: 10.5, cashReserve: 10 },
  { month: 'Apr', profitMargin: 14, industryAvg: 10.8, cashReserve: 11 },
  { month: 'May', profitMargin: 18, industryAvg: 11, cashReserve: 12 },
  { month: 'Jun', profitMargin: 20, industryAvg: 11.2, cashReserve: 14 },
  { month: 'Jul', profitMargin: 21, industryAvg: 11.5, cashReserve: 15 },
  { month: 'Aug', profitMargin: 22, industryAvg: 11.8, cashReserve: 16 },
  { month: 'Sep', profitMargin: 24, industryAvg: 12, cashReserve: 18 },
];

const BusinessHealthIndicators = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <CardTitle className="text-sm font-medium mb-4">Business Health Trends</CardTitle>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tickLine={false}
                tick={{ fontSize: 12 }}
                axisLine={false}
                unit="%"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border)',
                  borderRadius: '0.5rem', 
                  fontSize: '0.75rem' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="profitMargin" 
                stroke="var(--primary)" 
                strokeWidth={2} 
                dot={false}
                name="Profit Margin"
              />
              <Line 
                type="monotone" 
                dataKey="industryAvg" 
                stroke="var(--muted-foreground)" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
                name="Industry Average"
              />
              <Line 
                type="monotone" 
                dataKey="cashReserve" 
                stroke="#1E40AF" 
                strokeWidth={2} 
                dot={false}
                name="Cash Reserve Ratio"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
            <span className="text-xs">Profit Margin</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2 bg-muted-foreground"></div>
            <span className="text-xs">Industry Average</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#1E40AF" }}></div>
            <span className="text-xs">Cash Reserve Ratio</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessHealthIndicators;
