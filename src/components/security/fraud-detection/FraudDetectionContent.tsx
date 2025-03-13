
import React from "react";
import RiskScoreCard from "./RiskScoreCard";
import FraudAlertList from "./FraudAlertList";
import SecurityTip from "./SecurityTip";
import { FraudAlert, RiskScoreData } from "./types";

interface FraudDetectionContentProps {
  riskScoreData: RiskScoreData;
  fraudAlerts: FraudAlert[];
}

const FraudDetectionContent: React.FC<FraudDetectionContentProps> = ({ riskScoreData, fraudAlerts }) => {
  return (
    <div className="space-y-6">
      {/* Risk Score */}
      <RiskScoreCard riskScoreData={riskScoreData} />

      {/* Alerts Section */}
      <FraudAlertList alerts={fraudAlerts} />

      {/* Security Tip Alert */}
      <SecurityTip />
    </div>
  );
};

export default FraudDetectionContent;
