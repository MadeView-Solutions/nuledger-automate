
import React from "react";

const VoiceHelp: React.FC = () => {
  return (
    <div className="text-xs text-muted-foreground">
      <p>Try saying phrases like:</p>
      <ul className="list-disc list-inside mt-1 space-y-1">
        <li>"Log a $200 office expense from Staples on March 5th."</li>
        <li>"Transfer $5,000 from checking to payroll account."</li>
        <li>"Record $1,500 revenue from client XYZ for consulting."</li>
      </ul>
    </div>
  );
};

export default VoiceHelp;
