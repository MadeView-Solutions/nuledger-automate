
export type FraudAlertSeverity = "high" | "medium" | "low";
export type FraudAlertStatus = "unresolved" | "resolved" | "monitoring";

export interface FraudAlert {
  id: string;
  severity: FraudAlertSeverity;
  description: string;
  timestamp: string;
  status: FraudAlertStatus;
}

export interface RiskScoreCategory {
  transactionSecurity: number;
  userAuthentication: number;
  dataProtection: number;
  vendorRisk: number;
}

export interface RiskScoreData {
  overall: number;
  previousScore: number;
  categories: RiskScoreCategory;
}
