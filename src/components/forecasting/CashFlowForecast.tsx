
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Download } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const cashFlowData = [
  { name: 'Jan', revenue: 24000, expenses: 18000, cashFlow: 6000 },
  { name: 'Feb', revenue: 26000, expenses: 16000, cashFlow: 10000 },
  { name: 'Mar', revenue: 32000, expenses: 20000, cashFlow: 12000 },
  { name: 'Apr', revenue: 28000, expenses: 22000, cashFlow: 6000 },
  { name: 'May', revenue: 35000, expenses: 24000, cashFlow: 11000 },
  { name: 'Jun', revenue: 42000, expenses: 28000, cashFlow: 14000 },
  { name: 'Jul', revenue: 40000, expenses: 30000, cashFlow: 10000 },
  { name: 'Aug', revenue: 45000, expenses: 27000, cashFlow: 18000 },
  { name: 'Sep', revenue: 48000, expenses: 32000, cashFlow: 16000 },
  { name: 'Oct', revenue: 52000, expenses: 35000, cashFlow: 17000 },
  { name: 'Nov', revenue: 55000, expenses: 38000, cashFlow: 17000 },
  { name: 'Dec', revenue: 58000, expenses: 40000, cashFlow: 18000 },
];

const forecastData = [
  { name: 'Jan', revenue: 60000, expenses: 41000, cashFlow: 19000 },
  { name: 'Feb', revenue: 62000, expenses: 42000, cashFlow: 20000 },
  { name: 'Mar', revenue: 65000, expenses: 43000, cashFlow: 22000 },
];

const combinedData = [...cashFlowData, ...forecastData];

const CashFlowForecast = () => {
  const [timeframe, setTimeframe] = useState("12m");
  
  // Filter data based on selected timeframe
  const getFilteredData = () => {
    if (timeframe === "3m") {
      return combinedData.slice(-6, -3);
    } else if (timeframe === "6m") {
      return combinedData.slice(-9, -3);
    } else if (timeframe === "12m") {
      return combinedData.slice(0, -3);
    } else if (timeframe === "forecast") {
      return combinedData.slice(-6);
    }
    return combinedData.slice(0, -3); // Default to 12m
  };
  
  const filteredData = getFilteredData();
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                Cash Flow Forecast
                <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-950">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </CardTitle>
              <CardDescription>
                AI-generated cash flow projections based on historical data
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="12m" onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="12m">Last 12 Months</SelectItem>
                  <SelectItem value="forecast">3-Month Forecast</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorCashFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" name="Expenses" />
                <Area type="monotone" dataKey="cashFlow" stroke="#10b981" fillOpacity={1} fill="url(#colorCashFlow)" name="Cash Flow" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-3">
          <div className="text-sm text-muted-foreground">
            Our AI analyzes transaction patterns to forecast future financial performance
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CashFlowForecast;
