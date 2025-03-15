
import React from "react";
import { Badge } from "@/components/ui/badge";
import { TransactionStatus } from "./TransactionTypes";

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  confidence?: number;
}

const TransactionStatusBadge = ({ status, confidence }: TransactionStatusBadgeProps) => {
  const getVariant = () => {
    switch (status) {
      case "ai-categorized":
        return "default";
      case "manual":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getLabel = () => {
    if (status === "ai-categorized" && confidence) {
      return `AI (${Math.round(confidence * 100)}%)`;
    }
    if (status === "manual") {
      return "Manual";
    }
    return "Pending";
  };

  return (
    <Badge variant={getVariant()}>
      {getLabel()}
    </Badge>
  );
};

export default TransactionStatusBadge;
