
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import QuickbooksLogo from "./logos/QuickbooksLogo";
import StripeLogo from "./logos/StripeLogo";
import SageLogo from "./logos/SageLogo";
import SquareLogo from "./logos/SquareLogo";

const IntegrationsSummary = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleViewAll = () => {
    navigate("/integrations");
  };

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4 md:p-6">
        <CardTitle className="text-base md:text-lg">Integrations & APIs</CardTitle>
        <Button 
          variant="ghost" 
          size={isMobile ? "sm" : "default"}
          onClick={handleViewAll} 
          className="flex items-center"
        >
          View All
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <IntegrationItem 
            name="QuickBooks" 
            icon={<QuickbooksLogo />} 
            status="connected" 
            lastSynced="2 hours ago"
          />
          <IntegrationItem 
            name="Stripe" 
            icon={<StripeLogo />} 
            status="connected" 
            lastSynced="1 day ago"
          />
          <IntegrationItem 
            name="Sage" 
            icon={<SageLogo />} 
            status="available" 
          />
          <IntegrationItem 
            name="Square" 
            icon={<SquareLogo />} 
            status="available" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

type IntegrationItemProps = {
  name: string;
  icon: React.ReactNode;
  status: "connected" | "available" | "error";
  lastSynced?: string;
};

const IntegrationItem = ({ name, icon, status, lastSynced }: IntegrationItemProps) => {
  return (
    <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/20 transition-colors">
      <div className="mb-3">{icon}</div>
      <h3 className="font-medium text-center mb-1">{name}</h3>
      <Badge 
        variant="outline" 
        className={`text-xs capitalize ${
          status === "connected" 
            ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800" 
            : status === "error"
            ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-800"
            : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"
        }`}
      >
        {status}
      </Badge>
      {lastSynced && (
        <p className="text-xs text-muted-foreground mt-1">
          Last synced {lastSynced}
        </p>
      )}
    </div>
  );
};

export default IntegrationsSummary;
