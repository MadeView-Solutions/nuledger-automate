
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { connectedAccounts } from "@/data/mockAccounts";
import { Account } from "@/types/account";
import AccountItem from "./AccountItem";
import SecurityInfo from "./SecurityInfo";
import AccountListHeader from "./AccountListHeader";

const AccountSync = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>(connectedAccounts);
  const [isLoading, setIsLoading] = useState(false);

  const handleSyncAll = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Update last sync time for all connected accounts
      setAccounts(accounts.map(account => {
        if (account.status === "connected") {
          return {
            ...account,
            lastSync: new Date().toISOString()
          };
        }
        return account;
      }));
      
      toast({
        title: "Accounts Synced Successfully",
        description: "All your connected accounts have been synced with the latest data.",
        duration: 3000,
      });
    }, 2000);
  };

  const handleConnectAccount = () => {
    toast({
      title: "Connect New Account",
      description: "Opening account connection wizard. Follow the prompts to securely connect your account.",
      duration: 3000,
    });
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <AccountListHeader 
          onSyncAll={handleSyncAll}
          onConnectAccount={handleConnectAccount}
          isLoading={isLoading}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {accounts.map((account) => (
            <AccountItem 
              key={account.id}
              account={account}
              isLoading={isLoading}
            />
          ))}
        </div>
        
        <SecurityInfo />
      </CardContent>
    </Card>
  );
};

export default AccountSync;
