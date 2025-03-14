
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntegrationCard from "./IntegrationCard";
import AvalaraLogo from "./logos/AvalaraLogo";
import TurboTaxLogo from "./logos/TurboTaxLogo";
import IRSLogo from "./logos/IRSLogo";
import { Users, Globe, Briefcase, Building } from "lucide-react";

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
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 border-b pb-2">
              <Users className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-lg text-green-700">External Client Services</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <IntegrationCard
                title="TurboTax API"
                description="Simplify tax preparation by syncing financial data with TurboTax for client returns."
                icon={<TurboTaxLogo />}
                status="available"
                className="border-green-200 hover:border-green-300 dark:border-green-900 dark:hover:border-green-800"
              />
              
              <IntegrationCard
                title="IRS e-filing"
                description="Submit client tax returns electronically directly to the IRS with proper authentication."
                icon={<IRSLogo />}
                status="available"
                className="border-green-200 hover:border-green-300 dark:border-green-900 dark:hover:border-green-800"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 border-b pb-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium text-lg text-purple-700">International Tax Services</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <IntegrationCard
                title="Avalara"
                description="Automate sales tax calculations, returns, and compliance across multiple international jurisdictions."
                icon={<AvalaraLogo />}
                status="connected"
                lastSync="2023-07-10T16:20:00Z"
                className="border-purple-200 hover:border-purple-300 dark:border-purple-900 dark:hover:border-purple-800"
              />
              
              <IntegrationCard
                title="Global Tax API"
                description="Connect to worldwide tax authorities for automated international compliance."
                icon={<Globe className="h-10 w-10 text-purple-600" />}
                status="available"
                className="border-purple-200 hover:border-purple-300 dark:border-purple-900 dark:hover:border-purple-800"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3 border-b pb-2">
              <Building className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-lg text-blue-700">Internal Firm Accounts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <IntegrationCard
                title="Firm Tax Management"
                description="Manage the firm's own tax obligations, compliance tracking, and filing deadlines."
                icon={<Briefcase className="h-10 w-10 text-blue-600" />}
                status="connected"
                lastSync="2023-07-15T12:45:00Z"
                className="border-blue-200 hover:border-blue-300 dark:border-blue-900 dark:hover:border-blue-800"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxComplianceAPIs;
