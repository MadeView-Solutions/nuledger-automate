export interface SettlementCalculation {
  id: string;
  caseId: string;
  grossSettlement: number;
  attorneyFeePercent: number;
  attorneyFee: number;
  liens: Lien[];
  vendorPayments: VendorPayment[];
  expenses: number;
  netToClient: number;
  dateCreated: string;
  scenarioName?: string;
}

export interface Lien {
  id: string;
  type: 'medical' | 'subrogation' | 'medicare' | 'medicaid' | 'other';
  creditorName: string;
  originalAmount: number;
  negotiatedAmount?: number;
  status: 'pending' | 'negotiated' | 'paid' | 'waived';
  notes?: string;
}

export interface VendorPayment {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid';
  dueDate?: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: 'medical' | 'expert' | 'court_reporter' | 'investigator' | 'other';
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentTerms?: string;
  status: 'active' | 'inactive';
  dateAdded: string;
}

export interface VendorPayable {
  id: string;
  vendorId: string;
  caseId: string;
  amount: number;
  description: string;
  invoiceNumber?: string;
  dateIncurred: string;
  dueDate?: string;
  status: 'pending' | 'approved' | 'paid' | 'disputed';
  notes?: string;
}

export interface ReductionRequest {
  id: string;
  lienId: string;
  caseId: string;
  creditorName: string;
  originalAmount: number;
  requestedAmount: number;
  status: 'draft' | 'submitted' | 'pending' | 'approved' | 'denied';
  submittedDate?: string;
  responseDate?: string;
  finalAmount?: number;
  documents: Document[];
  notes?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'agreement' | 'correspondence' | 'invoice' | 'medical_records' | 'other';
  url: string;
  uploadedDate: string;
  instructions?: string;
  followUpSteps?: string[];
  assignedTo?: string;
  status: 'pending_review' | 'reviewed' | 'approved' | 'action_required';
}