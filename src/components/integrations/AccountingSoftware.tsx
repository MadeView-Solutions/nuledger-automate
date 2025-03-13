
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntegrationCard from "./IntegrationCard";
import QuickbooksLogo from "./logos/QuickbooksLogo";
import XeroLogo from "./logos/XeroLogo";
import FreshbooksLogo from "./logos/FreshbooksLogo";
import SageLogo from "./logos/SageLogo";

const AccountingSoftware = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Accounting Software Integrations</CardTitle>
          <CardDescription>
            Connect your NuLedger account with popular accounting software platforms to streamline your workflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <IntegrationCard
              title="QuickBooks"
              description="Sync transactions, invoices, and financial data with QuickBooks."
              icon={<QuickbooksLogo />}
              status="connected"
              lastSync="2023-07-15T14:30:00Z"
            />
            
            <IntegrationCard
              title="Xero"
              description="Connect with Xero for comprehensive financial management."
              icon={<XeroLogo />}
              status="available"
            />
            
            <IntegrationCard
              title="FreshBooks"
              description="Streamline your invoicing and expense tracking with FreshBooks."
              icon={<FreshbooksLogo />}
              status="available"
            />
            
            <IntegrationCard
              title="Sage"
              description="Integrate with Sage for advanced accounting and business management."
              icon={<SageLogo />}
              status="maintenance"
              maintenanceMsg="Integration undergoing updates. Available soon."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountingSoftware;
