
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntegrationCard from "./IntegrationCard";
import AvalaraLogo from "./logos/AvalaraLogo";
import TurboTaxLogo from "./logos/TurboTaxLogo";
import IRSLogo from "./logos/IRSLogo";

const TaxComplianceAPIs = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tax & Compliance Integrations</CardTitle>
          <CardDescription>
            Streamline tax calculation, filing, and compliance with specialized tax service integrations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <IntegrationCard
              title="Avalara"
              description="Automate sales tax calculations, returns, and compliance across multiple jurisdictions."
              icon={<AvalaraLogo />}
              status="connected"
              lastSync="2023-07-10T16:20:00Z"
            />
            
            <IntegrationCard
              title="TurboTax API"
              description="Simplify tax preparation by syncing financial data with TurboTax."
              icon={<TurboTaxLogo />}
              status="available"
            />
            
            <IntegrationCard
              title="IRS e-filing"
              description="Submit tax returns electronically directly to the IRS with proper authentication."
              icon={<IRSLogo />}
              status="available"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxComplianceAPIs;
