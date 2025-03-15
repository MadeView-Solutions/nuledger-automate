
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { accountingPlatforms } from "./AccountingPlatforms";
import { CustomPlatform } from "./AccountingPlatformTypes";
import QuickbooksLogo from "@/components/integrations/logos/QuickbooksLogo";

interface PlatformDisplayProps {
  selectedPlatform: string;
  customPlatforms: CustomPlatform[];
  isConnected: boolean;
  lastSynced: Date | null;
}

const PlatformDisplay: React.FC<PlatformDisplayProps> = ({
  selectedPlatform,
  customPlatforms,
  isConnected,
  lastSynced,
}) => {
  // Get the currently selected platform details
  const currentPlatform = accountingPlatforms.find(p => p.id === selectedPlatform) || 
    (customPlatforms.find(p => p.id === selectedPlatform) ? 
      { name: customPlatforms.find(p => p.id === selectedPlatform)?.name || "", available: false } : 
      accountingPlatforms[0]);

  // Determine which logo to render
  const renderLogo = () => {
    if (selectedPlatform.startsWith('custom-')) {
      // For custom platforms, use the QuickBooks logo as a fallback
      return <QuickbooksLogo />;
    }
    
    const platform = accountingPlatforms.find(p => p.id === selectedPlatform);
    if (platform) {
      const Logo = platform.logo;
      return <Logo />;
    }
    
    return <QuickbooksLogo />;
  };

  const getPlatformAvailability = () => {
    if (selectedPlatform.startsWith('custom-')) {
      return false;
    }
    
    const platform = accountingPlatforms.find(p => p.id === selectedPlatform);
    return platform ? platform.available : false;
  };
  
  const platformAvailable = getPlatformAvailability();

  return (
    <>
      <div className="flex items-center mb-3 gap-2">
        <div className="h-10 w-10">
          {renderLogo()}
        </div>
        <div>
          <h4 className="text-sm font-medium">{currentPlatform.name}</h4>
          <Badge variant={platformAvailable && isConnected ? "default" : "outline"}>
            {selectedPlatform.startsWith('custom-') 
              ? "Custom Platform" 
              : (platformAvailable ? (isConnected ? "Connected" : "Not Connected") : "Coming Soon")}
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
      
      {selectedPlatform !== "quickbooks" && !selectedPlatform.startsWith('custom-') && (
        <div className="flex items-center text-sm text-amber-600 mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{currentPlatform.name} integration is coming soon</span>
        </div>
      )}
      
      {selectedPlatform.startsWith('custom-') && (
        <div className="flex items-center text-sm text-amber-600 mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>Custom platform integration development in progress</span>
        </div>
      )}
    </>
  );
};

export default PlatformDisplay;
