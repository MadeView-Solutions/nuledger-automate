
import React from "react";
import { Shield } from "lucide-react";

const SecurityInfo = () => {
  return (
    <div className="mt-6 flex items-center justify-center rounded-lg border border-dashed p-8">
      <div className="text-center">
        <Shield className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="font-medium mb-1">Bank-Level Security</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          NuLedger uses industry-standard encryption and security practices. 
          We never store your bank credentials and use secure token-based access.
        </p>
      </div>
    </div>
  );
};

export default SecurityInfo;
