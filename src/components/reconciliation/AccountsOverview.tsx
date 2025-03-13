
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { connectedAccounts } from "@/data/mockAccounts";
import { formatCurrency } from "@/utils/formatters";

const AccountsOverview = () => {
  // Group accounts by type
  const accountsByType = connectedAccounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, typeof connectedAccounts>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Synced Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(accountsByType).map(([type, accounts]) => (
              <div key={type} className="space-y-4">
                <h3 className="font-medium capitalize">{type} Accounts</h3>
                <div className="space-y-3">
                  {accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-sm text-muted-foreground">{account.provider}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-medium">
                          {formatCurrency(account.balance)}
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="w-24 mr-2">
                            <Progress 
                              value={account.status === "connected" ? 100 : account.status === "error" ? 30 : 60} 
                              className={`h-2 ${
                                account.status === "connected" 
                                  ? "bg-green-100" 
                                  : account.status === "error" 
                                  ? "bg-red-100" 
                                  : "bg-amber-100"
                              }`}
                            />
                          </div>
                          <span className="text-xs capitalize">{account.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Last Reconciliation</div>
              <div className="text-2xl font-semibold mt-1">June 15, 2023</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Pending Transactions</div>
              <div className="text-2xl font-semibold mt-1">42</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Flagged Discrepancies</div>
              <div className="text-2xl font-semibold mt-1">3</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsOverview;
