
import { FraudAlertSeverity, FraudAlertStatus } from "./types";

export const getSeverityColor = (severity: FraudAlertSeverity) => {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "medium":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    case "low":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export const getStatusColor = (status: FraudAlertStatus) => {
  switch (status) {
    case "unresolved":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    case "resolved":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "monitoring":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};
