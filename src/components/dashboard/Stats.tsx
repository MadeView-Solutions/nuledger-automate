
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
  { name: 'Feb', revenue: 5000, expenses: 2800, profit: 2200 },
  { name: 'Mar', revenue: 4500, expenses: 2650, profit: 1850 },
  { name: 'Apr', revenue: 5500, expenses: 3000, profit: 2500 },
  { name: 'May', revenue: 6000, expenses: 3100, profit: 2900 },
  { name: 'Jun', revenue: 7000, expenses: 3500, profit: 3500 },
  { name: 'Jul', revenue: 8000, expenses: 3800, profit: 4200 },
  { name: 'Aug', revenue: 7500, expenses: 3700, profit: 3800 },
  { name: 'Sep', revenue: 8500, expenses: 4000, profit: 4500 },
  { name: 'Oct', revenue: 9000, expenses: 4200, profit: 4800 },
  { name: 'Nov', revenue: 9500, expenses: 4500, profit: 5000 },
  { name: 'Dec', revenue: 10000, expenses: 4800, profit: 5200 },
];

const Stats = () => {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold">Financial Overview</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Revenue, expenses and profit for the last 12 months
        </p>
      </div>
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b78f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b78f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e5e7eb'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, '']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b78f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                name="Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorExpenses)" 
                name="Expenses"
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorProfit)" 
                name="Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-8 mt-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-nuledger-500 mr-2"></div>
            <span className="text-sm font-medium">Revenue</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm font-medium">Expenses</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm font-medium">Profit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
