
import { InvoiceStatus } from "@/types/invoice";

export const getStatusColor = (status: InvoiceStatus): string => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "pending":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    case "overdue":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};
