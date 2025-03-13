
import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";

interface FraudDetectionHeaderProps {
  isScanning: boolean;
  onScanNow: () => void;
}

const FraudDetectionHeader: React.FC<FraudDetectionHeaderProps> = ({
  isScanning,
  onScanNow,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center">
        <Shield className="h-5 w-5 text-primary mr-2" />
        <div>
          <h2 className="text-xl font-semibold">AI Fraud Detection</h2>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring and anomaly detection
          </p>
        </div>
      </div>
      <Button 
        onClick={onScanNow} 
        disabled={isScanning}
        className="w-full md:w-auto"
      >
        {isScanning ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Scanning...
          </>
        ) : (
          <>Scan Now</>
        )}
      </Button>
    </div>
  );
};

export default FraudDetectionHeader;
