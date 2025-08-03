export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  type: 'operating' | 'case-specific';
  caseId?: string;
  caseName?: string;
  date: string;
  vendor?: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'reimbursed';
  assignedTo?: string;
  notes?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  type: 'operating' | 'case-specific';
  description?: string;
  recoverable?: boolean;
}

export interface Settlement {
  id: string;
  caseId: string;
  caseName: string;
  amount: number;
  date: string;
  negotiatorId: string;
  negotiatorName: string;
  status: 'pending' | 'approved' | 'disbursed';
  timeToSettle?: number; // days
  feeAmount?: number;
  recoveryRatio?: number;
}

export interface NegotiatorPerformance {
  negotiatorId: string;
  negotiatorName: string;
  totalSettlements: number;
  totalValue: number;
  averageTimeToSettle: number;
  averageSettlementValue: number;
  feeRecoveryRatio: number;
  monthlyVolume: number;
}

export interface TrustAlert {
  id: string;
  type: 'balance_warning' | 'reconciliation_issue' | 'compliance_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  caseId?: string;
  amount?: number;
  dueDate?: string;
  resolved: boolean;
}