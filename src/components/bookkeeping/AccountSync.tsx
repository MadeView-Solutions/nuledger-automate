
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownUp, 
  BadgeCheck, 
  Clock, 
  RefreshCw, 
  Shield, 
  CircleX, 
  Plus,
  Bank,
  CreditCard,
  Wallet,
  Briefcase
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock connected accounts data
const connectedAccounts = [
  {
    id: "acc1",
    name: "Business Checking",
    type: "bank",
    provider: "Chase Bank",
    status: "connected",
    lastSync: "2023-06-10T14:30:00",
    balance: 24532.67
  },
  {
    id: "acc2",
    name: "Business Savings",
    type: "bank",
    provider: "Chase Bank",
    status: "connected",
    lastSync: "2023-06-10T14:30:00",
    balance: 52750.80
  },
  {
    id: "acc3",
    name: "Corporate Card",
    type: "card",
    provider: "American Express",
    status: "connected",
    lastSync: "2023-06-09T10:15:00",
    balance: -3245.19
  },
  {
    id: "acc4",
    name: "Stripe",
    type: "payment",
    provider: "Stripe",
    status: "connected",
    lastSync: "2023-06-08T18:45:00",
    balance: 8976.42
  },
  {
    id: "acc5",
    name: "PayPal Business",
    type: "payment",
    provider: "PayPal",
    status: "error",
    lastSync: "2023-06-05T09:20:00",
    balance: 1253.89
  },
  {
    id: "acc6",
    name: "Investment Account",
    type: "investment",
    provider: "Vanguard",
    status: "pending",
    lastSync: null,
    balance: 0
  }
];

const AccountSync = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState(connectedAccounts);
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

  const getAccountIcon = (type) => {
    switch (type) {
      case "bank":
        return <Bank className="h-5 w-5" />;
      case "card":
        return <CreditCard className="h-5 w-5" />;
      case "payment":
        return <Wallet className="h-5 w-5" />;
      case "investment":
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Bank className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status) => {
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

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Account Sync</CardTitle>
            <CardDescription>
              Connect and sync your financial accounts
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleConnectAccount}>
              <Plus className="mr-2 h-4 w-4" />
              Connect Account
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleSyncAll}
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
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {accounts.map((account) => (
            <div 
              key={account.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-2 mr-4">
                  {getAccountIcon(account.type)}
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
                  {getStatusBadge(account.status)}
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
          ))}
        </div>
        
        <div className="mt-6 flex items-center justify-center rounded-lg border border-dashed p-8">
          <div className="text-center">
            <Shield className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="font-medium mb-1">Bank-Level Security</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              NuLedger uses industry-standard encryption and security practices. 
              We never store your bank credentials and use secure token-based access.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSync;
