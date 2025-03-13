
import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import AccountIcon from "@/components/bookkeeping/AccountIcon";
import AccountStatusBadge from "@/components/bookkeeping/AccountStatusBadge";
import { Account } from "@/types/account";

interface AccountItemProps {
  account: Account;
  isLoading: boolean;
}

const AccountItem = ({ account, isLoading }: AccountItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
      <div className="flex items-center">
        <div className="bg-primary/10 rounded-full p-2 mr-4">
          <AccountIcon type={account.type} />
        </div>
        <div>
          <h3 className="font-medium">{account.name}</h3>
          <p className="text-sm text-muted-foreground">{account.provider}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-8">
        <div className="text-right">
          <div className="font-medium">
            {account.status === "connected" && (
              account.balance >= 0 
                ? `$${account.balance.toFixed(2)}` 
                : `-$${Math.abs(account.balance).toFixed(2)}`
            )}
            {account.status !== "connected" && "—"}
          </div>
          <div className="text-xs text-muted-foreground">
            {account.lastSync 
              ? `Last synced ${new Date(account.lastSync).toLocaleString()}`
              : "Not yet synced"}
          </div>
        </div>
        
        <div className="min-w-28">
          <AccountStatusBadge status={account.status} />
        </div>
        
        <div>
          <Button 
            variant="ghost" 
            size="sm"
            disabled={account.status === "pending" || isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountItem;
