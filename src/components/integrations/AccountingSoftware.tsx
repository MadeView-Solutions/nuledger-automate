
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntegrationCard from "./IntegrationCard";
import QuickBooksConnect from "./QuickBooksConnect";
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
          <div className="grid grid-cols-1 gap-6">
            {/* Enhanced QuickBooks integration with real connection capabilities */}
            <QuickBooksConnect />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountingSoftware;
