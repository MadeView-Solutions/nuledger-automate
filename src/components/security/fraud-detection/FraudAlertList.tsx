
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { FraudAlert } from "./types";
import { getSeverityColor, getStatusColor } from "./utils";

interface FraudAlertListProps {
  alerts: FraudAlert[];
}

const FraudAlertList: React.FC<FraudAlertListProps> = ({ alerts }) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Recent Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border rounded-lg p-4 flex flex-col md:flex-row justify-between"
          >
            <div className="flex items-start gap-3">
              <div
                className={`rounded-full p-2 ${
                  alert.severity === "high"
                    ? "bg-red-100 dark:bg-red-900/30"
                    : alert.severity === "medium"
                    ? "bg-amber-100 dark:bg-amber-900/30"
                    : "bg-blue-100 dark:bg-blue-900/30"
                }`}
              >
                <AlertTriangle
                  className={`h-4 w-4 ${
                    alert.severity === "high"
                      ? "text-red-600 dark:text-red-400"
                      : alert.severity === "medium"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                />
              </div>
              <div>
                <p className="font-medium text-sm">{alert.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Badge className={getSeverityColor(alert.severity)}>
                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
              </Badge>
              <Badge className={getStatusColor(alert.status)}>
                {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FraudAlertList;
