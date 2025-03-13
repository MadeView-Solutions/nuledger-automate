
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, Activity } from "lucide-react";

interface FraudDetectionHeaderProps {
  isScanning: boolean;
  onScanNow: () => void;
}

const FraudDetectionHeader: React.FC<FraudDetectionHeaderProps> = ({ isScanning, onScanNow }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <CardTitle className="flex items-center">
          Fraud Detection & Risk Management
          <Badge variant="outline" className="ml-2 bg-red-50 dark:bg-red-950">
            <ShieldAlert className="h-3 w-3 mr-1" />
            AI Protected
          </Badge>
        </CardTitle>
        <CardDescription>
          Real-time monitoring and analysis of financial activities
        </CardDescription>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onScanNow}
        disabled={isScanning}
        className="w-full md:w-auto"
      >
        {isScanning ? (
          <>
            <Activity className="mr-2 h-4 w-4 animate-pulse" />
            Scanning...
          </>
        ) : (
          <>
            <ShieldAlert className="mr-2 h-4 w-4" />
            Scan Now
          </>
        )}
      </Button>
    </div>
  );
};

export default FraudDetectionHeader;
