
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Shield } from "lucide-react";
import { fraudAlerts, riskScoreData } from "./fraud-detection/mockData";
import FraudDetectionHeader from "./fraud-detection/FraudDetectionHeader";
import FraudDetectionContent from "./fraud-detection/FraudDetectionContent";

const FraudDetection = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);

  const handleScanNow = () => {
    setIsScanning(true);
    toast({
      title: "Fraud Detection Scan Started",
      description: "AI is analyzing your transactions and activities for potential fraud patterns.",
      duration: 3000,
    });

    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Scan Completed",
        description: "No new fraud indicators detected in your recent activities.",
        duration: 3000,
      });
    }, 3000);
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <FraudDetectionHeader isScanning={isScanning} onScanNow={handleScanNow} />
      </CardHeader>
      <CardContent>
        <FraudDetectionContent riskScoreData={riskScoreData} fraudAlerts={fraudAlerts} />
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="text-sm text-muted-foreground">
          <Shield className="h-4 w-4 mr-2 inline-block" />
          AI continuously monitors for suspicious patterns and anomalies in real-time
        </div>
      </CardFooter>
    </Card>
  );
};

export default FraudDetection;
