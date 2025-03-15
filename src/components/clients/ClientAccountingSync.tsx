
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Client } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuickBooks } from "@/hooks/useQuickBooks";
import { quickbooksService } from "@/services/integrations/quickbooks";
import { CustomPlatform } from "./accounting/AccountingPlatformTypes";
import PlatformSelector from "./accounting/PlatformSelector";
import PlatformDisplay from "./accounting/PlatformDisplay";
import SyncButton from "./accounting/SyncButton";

interface ClientAccountingSyncProps {
  client: Client;
}

const ClientAccountingSync: React.FC<ClientAccountingSyncProps> = ({ client }) => {
  const { isConnected } = useQuickBooks();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("quickbooks");
  const [customPlatforms, setCustomPlatforms] = useState<CustomPlatform[]>([]);

  const handlePlatformChange = (value: string) => {
    setSelectedPlatform(value);
  };

  const handleAddCustomPlatform = (name: string) => {
    const newPlatformId = `custom-${Date.now()}`;
    setCustomPlatforms([...customPlatforms, { 
      id: newPlatformId, 
      name: name
    }]);
    setSelectedPlatform(newPlatformId);
    
    toast({
      title: "Custom Platform Added",
      description: `${name} has been added to your platforms list.`,
    });
  };

  const handleSync = async () => {
    if (!isConnected) {
      toast({
        title: "QuickBooks Not Connected",
        description: "Please connect to QuickBooks first in Integrations.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatform !== "quickbooks") {
      toast({
        title: `${customPlatforms.find(p => p.id === selectedPlatform)?.name || 
                 "This platform"} Integration`,
        description: "This integration is coming soon. Currently only QuickBooks Online is fully supported.",
        variant: "default",
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Accounting Integration</h3>
        
        <div className="flex items-center gap-2">
          <PlatformSelector
            selectedPlatform={selectedPlatform}
            customPlatforms={customPlatforms}
            onPlatformChange={handlePlatformChange}
            onAddCustomPlatform={handleAddCustomPlatform}
          />
        </div>
      </div>
      
      <PlatformDisplay
        selectedPlatform={selectedPlatform}
        customPlatforms={customPlatforms}
        isConnected={isConnected}
        lastSynced={lastSynced}
      />
      
      <SyncButton
        selectedPlatform={selectedPlatform}
        customPlatforms={customPlatforms}
        isConnected={isConnected}
        isSyncing={isSyncing}
        onSync={handleSync}
      />
    </div>
  );
};

export default ClientAccountingSync;
