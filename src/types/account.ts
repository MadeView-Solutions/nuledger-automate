
export type AccountType = "bank" | "card" | "payment" | "investment";
export type AccountStatus = "connected" | "error" | "pending";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  provider: string;
  status: AccountStatus;
  lastSync: string | null;
  balance: number;
}
