
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield } from "lucide-react";

// Array of security tips
const securityTips = [
  "Enable two-factor authentication for all financial accounts to significantly enhance your security posture.",
  "Regularly update your passwords and use a password manager to maintain strong, unique credentials for each service.",
  "Monitor your accounts for suspicious activity and set up transaction alerts for unusual spending.",
  "Be cautious of phishing attempts - financial institutions will never ask for sensitive information via email.",
  "Use a secure, private network for financial transactions and avoid public Wi-Fi for sensitive operations.",
  "Keep your software updated to protect against known security vulnerabilities.",
  "Enable login notifications to be alerted when someone accesses your account from a new device.",
  "Review third-party app permissions regularly and revoke access for unused applications.",
];

const SecurityTip: React.FC = () => {
  const [currentTip, setCurrentTip] = useState("");

  // Select a random tip
  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * securityTips.length);
    return securityTips[randomIndex];
  };

  // Set initial tip on component mount
  useEffect(() => {
    setCurrentTip(getRandomTip());
  }, []);

  return (
    <Alert>
      <Shield className="h-4 w-4" />
      <AlertTitle>Security Tip</AlertTitle>
      <AlertDescription>
        {currentTip}
      </AlertDescription>
    </Alert>
  );
};

export default SecurityTip;
