
export type TaxFormStatus = "ready" | "in-progress" | "not-started";

export interface TaxForm {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: TaxFormStatus;
  completed: boolean;
  aiGenerated: boolean;
  irsData?: any; // Add field for IRS imported data
  lastImported?: string; // Timestamp of last IRS import
}

// Tax integrations
export interface IRSCredentials {
  taxId: string;
  pin?: string;
  clientId: string;
}

export interface IRSFormData {
  formId: string;
  formName: string;
  fields: Record<string, any>;
  year: number;
}
