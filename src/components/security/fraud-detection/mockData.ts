
import { FraudAlert, RiskScoreData } from "./types";

// Mock risk score data
export const riskScoreData: RiskScoreData = {
  overall: 85,
  previousScore: 78,
  categories: {
    transactionSecurity: 90,
    userAuthentication: 82,
    dataProtection: 88,
    vendorRisk: 76,
  },
};

// Mock fraud alerts
export const fraudAlerts: FraudAlert[] = [
  {
    id: "alert-1",
    severity: "high",
    description: "Unusual login attempt detected from an unrecognized IP address (198.51.100.24)",
    timestamp: "2023-06-05T14:32:00Z",
    status: "resolved",
  },
  {
    id: "alert-2",
    severity: "medium",
    description: "Multiple failed payment authorization attempts for the same transaction",
    timestamp: "2023-06-10T09:15:00Z",
    status: "monitoring",
  },
  {
    id: "alert-3",
    severity: "low",
    description: "Potential duplicate invoice detected for vendor ABC Corp (Invoice #INV-2023-567)",
    timestamp: "2023-06-12T16:48:00Z",
    status: "unresolved",
  },
];
