
export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  client: string;
  amount: number;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  aiGenerated: boolean;
}
