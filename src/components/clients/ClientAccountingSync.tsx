
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, AlertCircle, ChevronDown } from "lucide-react";
import { Client } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuickBooks } from "@/hooks/useQuickBooks";
import { quickbooksService } from "@/services/integrations/quickbooks";

// Import logos
import QuickbooksLogo from "@/components/integrations/logos/QuickbooksLogo";
import XeroLogo from "@/components/integrations/logos/XeroLogo";
import SageLogo from "@/components/integrations/logos/SageLogo";
import FreshbooksLogo from "@/components/integrations/logos/FreshbooksLogo";
import WaveLogo from "@/components/integrations/logos/WaveLogo";
import ZohoLogo from "@/components/integrations/logos/ZohoLogo";
import QuickBooksDesktopLogo from "@/components/integrations/logos/QuickBooksDesktopLogo";

interface ClientAccountingSyncProps {
  client: Client;
}

// Define available accounting platforms
const accountingPlatforms = [
  { id: "quickbooks", name: "QuickBooks Online", logo: QuickbooksLogo, available: true },
  { id: "quickbooks-desktop", name: "QuickBooks Desktop", logo: QuickBooksDesktopLogo, available: false },
  { id: "xero", name: "Xero", logo: XeroLogo, available: false },
  { id: "sage", name: "Sage", logo: SageLogo, available: false },
  { id: "freshbooks", name: "FreshBooks", logo: FreshbooksLogo, available: false },
  { id: "wave", name: "Wave", logo: WaveLogo, available: false },
  { id: "zoho", name: "Zoho Books", logo: ZohoLogo, available: false },
];

const ClientAccountingSync: React.FC<ClientAccountingSyncProps> = ({ client }) => {
  const { isConnected } = useQuickBooks();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("quickbooks");

  // Get the currently selected platform details
  const currentPlatform = accountingPlatforms.find(p => p.id === selectedPlatform) || accountingPlatforms[0];
  
  const PlatformLogo = currentPlatform.logo;
  const platformAvailable = currentPlatform.available;

  // Handle platform change
  const handlePlatformChange = (value: string) => {
    setSelectedPlatform(value);
    
    if (value !== "quickbooks") {
      toast({
        title: `${accountingPlatforms.find(p => p.id === value)?.name} Integration`,
        description: "This integration is coming soon. Currently only QuickBooks Online is fully supported.",
        variant: "default",
      });
    }
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
        title: `${currentPlatform.name} Integration`,
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
        
        <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {accountingPlatforms.map(platform => (
              <SelectItem key={platform.id} value={platform.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <platform.logo />
                  <span>{platform.name}</span>
                  {!platform.available && (
                    <span className="text-xs ml-2 text-muted-foreground">(Coming Soon)</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center mb-3 gap-2">
        <div className="h-10 w-10">
          <PlatformLogo />
        </div>
        <div>
          <h4 className="text-sm font-medium">{currentPlatform.name}</h4>
          <Badge variant={platformAvailable && isConnected ? "default" : "outline"}>
            {platformAvailable ? (isConnected ? "Connected" : "Not Connected") : "Coming Soon"}
          </Badge>
        </div>
      </div>

      {lastSynced && selectedPlatform === "quickbooks" && (
        <p className="text-sm text-muted-foreground mb-4">
          Last synced: {lastSynced.toLocaleString()}
        </p>
      )}
      
      {!isConnected && selectedPlatform === "quickbooks" && (
        <div className="flex items-center text-sm text-amber-600 mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>Connect to QuickBooks in Integrations to sync client data</span>
        </div>
      )}
      
      {selectedPlatform !== "quickbooks" && (
        <div className="flex items-center text-sm text-amber-600 mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{currentPlatform.name} integration is coming soon</span>
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        disabled={!platformAvailable || !isConnected || isSyncing || selectedPlatform !== "quickbooks"}
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
            Sync with {currentPlatform.name}
          </>
        )}
      </Button>
    </div>
  );
};

export default ClientAccountingSync;
