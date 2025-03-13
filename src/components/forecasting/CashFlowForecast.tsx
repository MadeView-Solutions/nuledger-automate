
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import { combinedData } from "./data/cashFlowData";
import CashFlowChart from "./CashFlowChart";
import TimeframeSelector from "./TimeframeSelector";

const CashFlowForecast = () => {
  const [timeframe, setTimeframe] = useState("12m");
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });
  
  const getFilteredData = () => {
    if (timeframe === "custom" && customDateRange.startDate && customDateRange.endDate) {
      // Filter data based on custom date range
      return combinedData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= customDateRange.startDate! && itemDate <= customDateRange.endDate!;
      });
    } else if (timeframe === "3m") {
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
  
  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setCustomDateRange({ startDate, endDate });
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
            <TimeframeSelector 
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              startDate={customDateRange.startDate || undefined}
              endDate={customDateRange.endDate || undefined}
              onDateRangeChange={handleDateRangeChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          <CashFlowChart data={filteredData} />
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
