
// Data for cash flow visualization
export const cashFlowData = [
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

export const forecastData = [
  { name: 'Jan', revenue: 60000, expenses: 41000, cashFlow: 19000 },
  { name: 'Feb', revenue: 62000, expenses: 42000, cashFlow: 20000 },
  { name: 'Mar', revenue: 65000, expenses: 43000, cashFlow: 22000 },
];

export const combinedData = [...cashFlowData, ...forecastData];
