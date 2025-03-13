
export type TaxFormStatus = "ready" | "in-progress" | "not-started";

export interface TaxForm {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: TaxFormStatus;
  completed: boolean;
  aiGenerated: boolean;
}
