
import React from "react";

interface TransactionFooterProps {
  filteredCount: number;
  totalCount: number;
}

const TransactionFooter = ({ filteredCount, totalCount }: TransactionFooterProps) => {
  return (
    <div className="text-sm text-muted-foreground">
      Showing {filteredCount} of {totalCount} transactions
    </div>
  );
};

export default TransactionFooter;
