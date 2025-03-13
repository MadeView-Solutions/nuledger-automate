
import React from "react";
import { InvoiceStatus } from "@/types/invoice";
import { getStatusColor } from "@/utils/invoiceUtils";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ status }) => {
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default InvoiceStatusBadge;
