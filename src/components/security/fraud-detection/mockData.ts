
import { FraudAlert, RiskScoreData } from "./types";

// Mock fraud detection data
export const fraudAlerts: FraudAlert[] = [
  {
    id: "fraud-1",
    severity: "high",
    description: "Unusual login attempt detected from unrecognized IP address",
    timestamp: "2023-06-16T08:45:23",
    status: "unresolved",
  },
  {
    id: "fraud-2",
    severity: "medium",
    description: "Multiple large transactions in short timeframe",
    timestamp: "2023-06-15T14:12:09",
    status: "resolved",
  },
  {
    id: "fraud-3",
    severity: "low",
    description: "New vendor payment pattern detected",
    timestamp: "2023-06-14T11:30:15",
    status: "monitoring",
  },
];

// Mock risk score data
export const riskScoreData: RiskScoreData = {
  overall: 82,
  previousScore: 65,
  categories: {
    transactionSecurity: 78,
    userAuthentication: 91,
    dataProtection: 84,
    vendorRisk: 73,
  },
};
