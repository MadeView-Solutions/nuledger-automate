
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface TimeframeSelectorProps {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ 
  timeframe, 
  onTimeframeChange 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Select defaultValue={timeframe} onValueChange={onTimeframeChange}>
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
  );
};

export default TimeframeSelector;
