
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface TimeframeSelectorProps {
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  timeframe,
  onTimeframeChange,
  startDate,
  endDate,
  onDateRangeChange,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(startDate);

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate && startDate) {
      // If we already have a start date, this is the end date
      if (newDate > startDate) {
        onDateRangeChange(startDate, newDate);
      } else {
        // If end date is before start date, swap them
        onDateRangeChange(newDate, startDate);
      }
    } else if (newDate) {
      // This is the start date
      onDateRangeChange(newDate, new Date(newDate.getTime() + 30 * 24 * 60 * 60 * 1000));
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex rounded-md border border-border">
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-none rounded-l-md ${timeframe === '3m' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
          onClick={() => onTimeframeChange('3m')}
        >
          3M
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-none border-x border-border ${timeframe === '6m' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
          onClick={() => onTimeframeChange('6m')}
        >
          6M
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-none ${timeframe === '12m' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
          onClick={() => onTimeframeChange('12m')}
        >
          12M
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-none border-l border-border ${timeframe === 'forecast' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
          onClick={() => onTimeframeChange('forecast')}
        >
          Forecast
        </Button>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={timeframe === 'custom' ? 'default' : 'outline'}
            size="sm"
            className="px-2"
            onClick={() => onTimeframeChange('custom')}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            {timeframe === 'custom' && startDate && endDate
              ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`
              : 'Custom'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimeframeSelector;
