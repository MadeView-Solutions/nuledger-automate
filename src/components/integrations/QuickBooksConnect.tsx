
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Link2, Power } from 'lucide-react';
import { useQuickBooks } from '@/hooks/useQuickBooks';
import QuickbooksLogo from './logos/QuickbooksLogo';
import { useToast } from '@/components/ui/use-toast';

const QuickBooksConnect = () => {
  const { isConnected, isLoading, connect, disconnect } = useQuickBooks();
  const { toast } = useToast();

  const handleSync = () => {
    toast({
      title: "Sync Started",
      description: "Syncing data with QuickBooks...",
    });
    
    // Simulate sync completion after 2 seconds
    setTimeout(() => {
      toast({
        title: "Sync Complete",
        description: "Data synchronized successfully with QuickBooks",
      });
    }, 2000);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-start space-x-4">
        <div className="w-12 h-12 flex items-center justify-center">
          <QuickbooksLogo />
        </div>
        <div>
          <CardTitle>QuickBooks Integration</CardTitle>
          <CardDescription>
            Connect with QuickBooks to sync clients, invoices, and financial data
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            {isConnected ? (
              <Badge className="bg-green-500">Connected</Badge>
            ) : (
              <Badge variant="outline">Disconnected</Badge>
            )}
          </div>
          
          {isConnected && (
            <div className="text-sm text-muted-foreground">
              Last synced: {new Date().toLocaleDateString()}
            </div>
          )}
        </div>
        
        {isConnected && (
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium">Synced Data</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted p-2 rounded text-sm flex justify-between">
                <span>Clients</span>
                <span className="font-mono">24</span>
              </div>
              <div className="bg-muted p-2 rounded text-sm flex justify-between">
                <span>Invoices</span>
                <span className="font-mono">87</span>
              </div>
              <div className="bg-muted p-2 rounded text-sm flex justify-between">
                <span>Transactions</span>
                <span className="font-mono">156</span>
              </div>
              <div className="bg-muted p-2 rounded text-sm flex justify-between">
                <span>Expenses</span>
                <span className="font-mono">92</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {isConnected ? (
          <>
            <Button variant="outline" size="sm" onClick={handleSync} disabled={isLoading}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Sync Now
            </Button>
            <Button variant="outline" size="sm" onClick={disconnect} disabled={isLoading}>
              <Power className="h-3 w-3 mr-1" />
              Disconnect
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={connect} disabled={isLoading}>
            <Link2 className="h-3 w-3 mr-1" />
            Connect to QuickBooks
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuickBooksConnect;
