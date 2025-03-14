
import React, { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Link2, Power } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  status: "connected" | "available" | "maintenance";
  lastSync?: string;
  maintenanceMsg?: string;
  className?: string; // Added className prop
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  icon,
  status,
  lastSync,
  maintenanceMsg,
  className,
}) => {
  const renderStatusBadge = () => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500">Connected</Badge>;
      case "available":
        return <Badge variant="outline">Available</Badge>;
      case "maintenance":
        return <Badge variant="secondary">Maintenance</Badge>;
      default:
        return null;
    }
  };

  const formatLastSync = (lastSyncTime: string) => {
    const date = new Date(lastSyncTime);
    return date.toLocaleString();
  };

  return (
    <div className={cn("border rounded-lg p-4 hover:shadow-md transition-shadow", className)}>
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{title}</h3>
            {renderStatusBadge()}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          
          {status === "connected" && lastSync && (
            <p className="text-xs text-muted-foreground mt-2">
              Last synced: {formatLastSync(lastSync)}
            </p>
          )}
          
          {status === "maintenance" && maintenanceMsg && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              {maintenanceMsg}
            </p>
          )}
          
          <div className="mt-4">
            {status === "connected" ? (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sync
                </Button>
                <Button variant="outline" size="sm">
                  <Power className="h-3 w-3 mr-1" />
                  Disconnect
                </Button>
              </div>
            ) : status === "available" ? (
              <Button size="sm">
                <Link2 className="h-3 w-3 mr-1" />
                Connect
              </Button>
            ) : (
              <Button size="sm" disabled>
                Coming Soon
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationCard;
