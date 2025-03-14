
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'business' | 'individual';
  status: 'active' | 'inactive' | 'pending';
  taxId?: string;
  businessName?: string;
  industry?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contacts?: {
    name: string;
    role: string;
    email: string;
    phone: string;
  }[];
  dateAdded: string;
  accountManager?: string;
  notes?: string;
  tasks?: ClientTask[];
  documents?: ClientDocument[];
  financialData?: FinancialData;
}

export interface ClientTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

export interface ClientDocument {
  id: string;
  name: string;
  type: 'tax' | 'financial' | 'legal' | 'other';
  dateUploaded: string;
  size: number; // in bytes
  url: string;
}

export interface FinancialData {
  yearlyRevenue?: number;
  taxRate?: number;
  fiscalYearEnd?: string;
  accountingMethod?: 'cash' | 'accrual';
  accountingPeriods?: 'monthly' | 'quarterly' | 'annually';
}
