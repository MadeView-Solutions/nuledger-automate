
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Client } from "@/types/client";
import { useQuickBooks } from "@/hooks/useQuickBooks";
import { useToast } from "@/components/ui/use-toast";
import { quickbooksService } from "@/services/integrations/quickbooks";

interface ClientQuickBooksSyncProps {
  client: Client;
}

const ClientQuickBooksSync: React.FC<ClientQuickBooksSyncProps> = ({ client }) => {
  const { isConnected } = useQuickBooks();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const handleSync = async () => {
    if (!isConnected) {
      toast({
        title: "QuickBooks Not Connected",
        description: "Please connect to QuickBooks first in Integrations.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    try {
      // Attempt to sync the client with QuickBooks
      await quickbooksService.syncClient(client);
      
      // Update last synced time
      const now = new Date();
      setLastSynced(now);
      
      toast({
        title: "Client Synced",
        description: `${client.name} was successfully synced with QuickBooks`,
      });
    } catch (error) {
      console.error('Error syncing client:', error);
      toast({
        title: "Sync Failed",
        description: "Could not sync client with QuickBooks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-muted/20">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">QuickBooks Integration</h3>
        <Badge variant={isConnected ? "default" : "outline"}>
          {isConnected ? "Connected" : "Not Connected"}
        </Badge>
      </div>
      
      {lastSynced && (
        <p className="text-sm text-muted-foreground mb-4">
          Last synced: {lastSynced.toLocaleString()}
        </p>
      )}
      
      {!isConnected && (
        <div className="flex items-center text-sm text-amber-600 mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>Connect to QuickBooks in Integrations to sync client data</span>
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        disabled={!isConnected || isSyncing}
        onClick={handleSync}
      >
        {isSyncing ? (
          <>
            <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <RefreshCw className="h-3 w-3 mr-2" />
            Sync with QuickBooks
          </>
        )}
      </Button>
    </div>
  );
};

export default ClientQuickBooksSync;
