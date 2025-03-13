
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface DataPoint {
  name: string;
  revenue: number;
  expenses: number;
  cashFlow: number;
}

interface CashFlowChartProps {
  data: DataPoint[];
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
  const chartConfig = {
    revenue: {
      label: "Revenue",
      theme: { light: "#4ade80", dark: "#4ade80" },
    },
    expenses: {
      label: "Expenses",
      theme: { light: "#f87171", dark: "#f87171" },
    },
    cashFlow: {
      label: "Cash Flow",
      theme: { light: "#60a5fa", dark: "#60a5fa" },
    },
  };

  // Calculate the index where forecast data starts (assuming the last 3 entries are forecast)
  const forecastStartIndex = data.length - 3;

  return (
    <ChartContainer config={chartConfig} className="aspect-[4/2]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis 
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          
          {/* Add a reference line to separate historical from forecast data */}
          {forecastStartIndex > 0 && (
            <ReferenceLine 
              x={data[forecastStartIndex - 1].name} 
              stroke="#888" 
              strokeDasharray="3 3"
              label={{ value: "Forecast →", position: "insideTopRight", fill: "#888", fontSize: 12 }}
            />
          )}
          
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            fill="var(--color-revenue)"
            fillOpacity={0.2}
            activeDot={{ r: 8 }}
            isAnimationActive={true}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="var(--color-expenses)"
            fill="var(--color-expenses)"
            fillOpacity={0.2}
            activeDot={{ r: 8 }}
            isAnimationActive={true}
          />
          <Area
            type="monotone"
            dataKey="cashFlow"
            stroke="var(--color-cashFlow)"
            fill="var(--color-cashFlow)"
            fillOpacity={0.4}
            activeDot={{ r: 8 }}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default CashFlowChart;
