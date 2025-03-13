
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const securityTips = [
  "Enable two-factor authentication for all financial accounts",
  "Regularly review and update access permissions for team members",
  "Monitor login locations and times for unusual activity",
  "Implement strong password policies and use a password manager",
  "Keep all software and systems updated with the latest security patches",
];

const SecurityTip: React.FC = () => {
  // Get a random tip from the array
  const tip = securityTips[Math.floor(Math.random() * securityTips.length)];

  return (
    <Alert variant="default" className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-700 dark:text-blue-400 ml-2">Security Tip</AlertTitle>
      <AlertDescription className="text-blue-700/80 dark:text-blue-400/80 ml-6">
        {tip}
      </AlertDescription>
    </Alert>
  );
};

export default SecurityTip;
