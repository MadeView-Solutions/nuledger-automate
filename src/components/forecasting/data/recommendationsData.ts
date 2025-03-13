
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'expense' | 'revenue' | 'cash flow';
  potentialSavings: number;
  status: 'recommendation' | 'opportunity' | 'warning';
  implementationTimeframe: string;
}

export const recommendations: Recommendation[] = [
  {
    id: "rec1",
    title: "Reduce Software Subscription Costs",
    description: "Several duplicate or underutilized software subscriptions were identified. Consolidating these tools could save significantly without impacting operations.",
    impact: "high",
    category: "expense",
    potentialSavings: 1250,
    status: "recommendation",
    implementationTimeframe: "1-2 weeks",
  },
  {
    id: "rec2",
    title: "Renegotiate Supplier Terms",
    description: "Based on your payment history and volume, AI analysis suggests three key vendors may offer better terms. Potential for extended payment terms and volume discounts.",
    impact: "medium",
    category: "expense",
    potentialSavings: 875,
    status: "recommendation",
    implementationTimeframe: "1 month",
  },
  {
    id: "rec3",
    title: "Optimize Inventory Levels",
    description: "Current inventory levels exceed projected demand by 22%. Reducing excess inventory would free up cash flow without affecting fulfillment rates.",
    impact: "high",
    category: "cash flow",
    potentialSavings: 3500,
    status: "recommendation",
    implementationTimeframe: "2-3 months",
  },
  {
    id: "rec4",
    title: "Implement Early Payment Discounts",
    description: "Offering a 2% discount for payments received within 10 days could accelerate cash flow and reduce days sales outstanding by an estimated 35%.",
    impact: "medium",
    category: "cash flow",
    potentialSavings: 950,
    status: "opportunity",
    implementationTimeframe: "2 weeks",
  },
  {
    id: "rec5",
    title: "Marketing Spend Reallocation",
    description: "ROI analysis indicates that reallocating budget from channel A to channel B could increase customer acquisition efficiency by 28%.",
    impact: "high",
    category: "revenue",
    potentialSavings: -1800,
    status: "opportunity",
    implementationTimeframe: "1 month",
  },
  {
    id: "rec6",
    title: "Impending Cash Flow Gap",
    description: "Seasonal patterns and outstanding receivables indicate a potential cash flow gap in Q3. Consider preparing additional working capital or credit line.",
    impact: "high",
    category: "cash flow",
    potentialSavings: 0,
    status: "warning",
    implementationTimeframe: "2 months",
  },
];
