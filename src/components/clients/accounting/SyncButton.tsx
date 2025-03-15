
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { accountingPlatforms } from "./AccountingPlatforms";
import { CustomPlatform } from "./AccountingPlatformTypes";

interface SyncButtonProps {
  selectedPlatform: string;
  customPlatforms: CustomPlatform[];
  isConnected: boolean;
  isSyncing: boolean;
  onSync: () => void;
}

const SyncButton: React.FC<SyncButtonProps> = ({
  selectedPlatform,
  customPlatforms,
  isConnected,
  isSyncing,
  onSync,
}) => {
  // Get the currently selected platform details
  const currentPlatform = accountingPlatforms.find(p => p.id === selectedPlatform) || 
    (customPlatforms.find(p => p.id === selectedPlatform) ? 
      { name: customPlatforms.find(p => p.id === selectedPlatform)?.name || "", available: false } : 
      accountingPlatforms[0]);

  const getPlatformAvailability = () => {
    if (selectedPlatform.startsWith('custom-')) {
      return false;
    }
    
    const platform = accountingPlatforms.find(p => p.id === selectedPlatform);
    return platform ? platform.available : false;
  };
  
  const platformAvailable = getPlatformAvailability();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full"
      disabled={!platformAvailable || !isConnected || isSyncing || selectedPlatform !== "quickbooks"}
      onClick={onSync}
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
  );
};

export default SyncButton;
