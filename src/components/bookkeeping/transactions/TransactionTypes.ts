
export type TransactionStatus = "ai-categorized" | "manual" | "pending";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: TransactionStatus;
  confidence?: number;
}

// Categories for transactions
export const transactionCategories = [
  "Advertising & Marketing",
  "Bank Fees",
  "Insurance",
  "Interest Paid",
  "Legal & Professional Services",
  "Meals & Entertainment",
  "Office Expenses",
  "Rent & Lease",
  "Repairs & Maintenance",
  "Software & IT",
  "Taxes & Licenses",
  "Travel",
  "Utilities",
  "Wages & Salaries",
  "Uncategorized",
];

// Mock transaction data
export const mockTransactions: Transaction[] = [
  {
    id: "TX789012",
    date: "2023-06-10",
    description: "Office Supplies - Amazon",
    category: "Office Expenses",
    amount: 156.78,
    status: "ai-categorized",
    confidence: 0.92,
  },
  {
    id: "TX789013",
    date: "2023-06-09",
    description: "Client Meeting - Coffee Shop",
    category: "Meals & Entertainment",
    amount: 32.50,
    status: "ai-categorized",
    confidence: 0.88,
  },
  {
    id: "TX789014",
    date: "2023-06-08",
    description: "Cloud Services - AWS",
    category: "Software & IT",
    amount: 329.99,
    status: "manual",
    confidence: 1.0,
  },
  {
    id: "TX789015",
    date: "2023-06-07",
    description: "Transportation - Uber",
    category: "Travel",
    amount: 24.50,
    status: "ai-categorized",
    confidence: 0.95,
  },
  {
    id: "TX789016",
    date: "2023-06-06",
    description: "Unidentified Payment",
    category: "Uncategorized",
    amount: 87.65,
    status: "pending",
    confidence: 0.42,
  },
];
