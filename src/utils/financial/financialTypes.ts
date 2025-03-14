
// Define types for the financial entries
export interface FinancialEntry {
  type: "expense" | "income" | "transfer";
  amount: number;
  source?: string;
  destination?: string;
  date?: Date;
  category?: string;
  description: string;
}
