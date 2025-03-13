
import React from "react";
import { ArrowDownUp, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";

interface AccountListHeaderProps {
  onSyncAll: () => void;
  onConnectAccount: () => void;
  isLoading: boolean;
}

const AccountListHeader = ({ onSyncAll, onConnectAccount, isLoading }: AccountListHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle>Account Sync</CardTitle>
        <CardDescription>
          Connect and sync your financial accounts
        </CardDescription>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={onConnectAccount}>
          <Plus className="mr-2 h-4 w-4" />
          Connect Account
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={onSyncAll}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <ArrowDownUp className="mr-2 h-4 w-4" />
              Sync All
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AccountListHeader;
