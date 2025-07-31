export type ClaimType = '3P' | '1P' | 'PIP' | 'MedPay' | 'DV';

export interface LegalCase {
  id: string;
  caseNumber: string;
  clientName: string;
  claimType: ClaimType;
  dateOpened: string;
  dateSettled?: string;
  settlementAmount?: number;
  status: 'open' | 'settled' | 'closed';
  attorneyName?: string;
  description?: string;
}

export interface CheckRecord {
  id: string;
  caseId: string;
  caseName: string;
  claimType: ClaimType;
  checkNumber?: string;
  amount: number;
  dateReceived?: string;
  dateExpected?: string;
  status: 'outstanding' | 'received' | 'deposited' | 'bounced';
  payerName: string;
  notes?: string;
}

export interface TimeAnalytics {
  caseId: string;
  caseName: string;
  claimType: ClaimType;
  dateOpened: string;
  dateSettled?: string;
  dateCheckReceived?: string;
  settlementDuration?: number; // days
  recoveryDuration?: number; // days
}

export interface FilevineCase {
  filevineId: string;
  caseId: string;
  lastSyncDate: string;
  syncStatus: 'success' | 'pending' | 'failed';
  errorMessage?: string;
}