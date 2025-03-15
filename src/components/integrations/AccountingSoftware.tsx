
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntegrationCard from "./IntegrationCard";
import QuickBooksConnect from "./QuickBooksConnect";
import XeroLogo from "./logos/XeroLogo";
import FreshbooksLogo from "./logos/FreshbooksLogo";
import SageLogo from "./logos/SageLogo";
import WaveLogo from "./logos/WaveLogo";
import ZohoLogo from "./logos/ZohoLogo";
import QuickBooksDesktopLogo from "./logos/QuickBooksDesktopLogo";
import NetSuiteLogo from "./logos/NetSuiteLogo";
import DynamicsLogo from "./logos/DynamicsLogo";
import SAPLogo from "./logos/SAPLogo";
import OracleLogo from "./logos/OracleLogo";
import WorkdayLogo from "./logos/WorkdayLogo";
import InforLogo from "./logos/InforLogo";
import BlackLineLogo from "./logos/BlackLineLogo";
import PatriotLogo from "./logos/PatriotLogo";
import DeltekLogo from "./logos/DeltekLogo";
import BenchLogo from "./logos/BenchLogo";

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
            {/* Enhanced QuickBooks Online integration with real connection capabilities */}
            <QuickBooksConnect />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Standard Accounting Integrations */}
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
                title="Wave"
                description="Free accounting software for small businesses and freelancers."
                icon={<WaveLogo />}
                status="available"
              />
              
              <IntegrationCard
                title="Zoho Books"
                description="Online accounting software for managing finances and compliance."
                icon={<ZohoLogo />}
                status="available"
              />
              
              <IntegrationCard
                title="QuickBooks Desktop"
                description="Connect your desktop QuickBooks software with our platform."
                icon={<QuickBooksDesktopLogo />}
                status="available"
              />
              
              <IntegrationCard
                title="Sage 50 / Business Cloud"
                description="Integrate with Sage for advanced accounting and business management."
                icon={<SageLogo />}
                status="maintenance"
                maintenanceMsg="Integration undergoing updates. Available soon."
              />
              
              {/* Enterprise Accounting Systems */}
              <IntegrationCard
                title="NetSuite"
                description="Oracle NetSuite for enterprise-grade financial management."
                icon={<NetSuiteLogo />}
                status="available"
                className="border-blue-100"
              />
              
              <IntegrationCard
                title="Microsoft Dynamics 365"
                description="Business Central integration for comprehensive ERP."
                icon={<DynamicsLogo />}
                status="available"
                className="border-blue-100"
              />
              
              <IntegrationCard
                title="SAP S/4HANA"
                description="Enterprise resource planning and financial management."
                icon={<SAPLogo />}
                status="available"
                className="border-blue-100"
              />
              
              <IntegrationCard
                title="Oracle ERP Cloud"
                description="Cloud-based enterprise resource planning solution."
                icon={<OracleLogo />}
                status="available"
                className="border-blue-100"
              />
              
              <IntegrationCard
                title="Workday Financial"
                description="Financial management and human capital management."
                icon={<WorkdayLogo />}
                status="available"
                className="border-blue-100"
              />
              
              <IntegrationCard
                title="Infor CloudSuite"
                description="Industry-specific ERP and financial solutions."
                icon={<InforLogo />}
                status="available"
                className="border-blue-100"
              />
              
              {/* Specialized Accounting Systems */}
              <IntegrationCard
                title="BlackLine"
                description="Financial close, accounting automation, and controls."
                icon={<BlackLineLogo />}
                status="available"
                className="border-green-100"
              />
              
              <IntegrationCard
                title="Patriot Accounting"
                description="Affordable accounting software for small businesses."
                icon={<PatriotLogo />}
                status="available"
                className="border-green-100"
              />
              
              <IntegrationCard
                title="Deltek Vision"
                description="Project-based accounting for professional services."
                icon={<DeltekLogo />}
                status="available"
                className="border-green-100"
              />
              
              <IntegrationCard
                title="Bench"
                description="Bookkeeping services integrated with our platform."
                icon={<BenchLogo />}
                status="available"
                className="border-green-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountingSoftware;
