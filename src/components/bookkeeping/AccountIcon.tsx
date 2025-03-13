
import React from "react";
import { Building2, CreditCard, Wallet, Briefcase } from "lucide-react";
import { AccountType } from "@/types/account";

interface AccountIconProps {
  type: AccountType;
  className?: string;
}

const AccountIcon = ({ type, className = "h-5 w-5" }: AccountIconProps) => {
  switch (type) {
    case "bank":
      return <Building2 className={className} />;
    case "card":
      return <CreditCard className={className} />;
    case "payment":
      return <Wallet className={className} />;
    case "investment":
      return <Briefcase className={className} />;
    default:
      return <Building2 className={className} />;
  }
};

export default AccountIcon;
