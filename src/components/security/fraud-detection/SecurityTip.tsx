
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield } from "lucide-react";

const SecurityTip: React.FC = () => {
  return (
    <Alert>
      <Shield className="h-4 w-4" />
      <AlertTitle>Security Tip</AlertTitle>
      <AlertDescription>
        Enable two-factor authentication for all financial accounts to significantly enhance your security posture.
      </AlertDescription>
    </Alert>
  );
};

export default SecurityTip;
