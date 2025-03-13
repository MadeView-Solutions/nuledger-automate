
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntegrationCard from "./IntegrationCard";
import StripeLogo from "./logos/StripeLogo";
import PayPalLogo from "./logos/PayPalLogo";
import PlaidLogo from "./logos/PlaidLogo";
import SquareLogo from "./logos/SquareLogo";

const BankingPayments = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banking & Payment Integrations</CardTitle>
          <CardDescription>
            Connect your payment processors and banking services for seamless financial operations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <IntegrationCard
              title="Stripe"
              description="Process payments, manage subscriptions, and handle financial transactions."
              icon={<StripeLogo />}
              status="connected"
              lastSync="2023-07-18T10:15:00Z"
            />
            
            <IntegrationCard
              title="PayPal"
              description="Accept PayPal payments and integrate with your invoicing system."
              icon={<PayPalLogo />}
              status="connected"
              lastSync="2023-07-17T08:45:00Z"
            />
            
            <IntegrationCard
              title="Plaid"
              description="Securely connect bank accounts for real-time data access and verification."
              icon={<PlaidLogo />}
              status="available"
            />
            
            <IntegrationCard
              title="Square"
              description="Integrate point-of-sale systems and payment processing with your accounting."
              icon={<SquareLogo />}
              status="available"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankingPayments;
