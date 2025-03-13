
import React from "react";
import { BadgeCheck, CircleX, Clock } from "lucide-react";
import { AccountStatus } from "@/types/account";

interface AccountStatusBadgeProps {
  status: AccountStatus;
}

const AccountStatusBadge = ({ status }: AccountStatusBadgeProps) => {
  switch (status) {
    case "connected":
      return (
        <div className="flex items-center text-green-600">
          <BadgeCheck className="h-4 w-4 mr-1" />
          <span>Connected</span>
        </div>
      );
    case "error":
      return (
        <div className="flex items-center text-red-600">
          <CircleX className="h-4 w-4 mr-1" />
          <span>Error</span>
        </div>
      );
    case "pending":
      return (
        <div className="flex items-center text-amber-600">
          <Clock className="h-4 w-4 mr-1" />
          <span>Pending</span>
        </div>
      );
    default:
      return null;
  }
};

export default AccountStatusBadge;
