
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Database, Brain, ArrowUpDown } from "lucide-react";

const TechStackInfo = () => {
  return (
    <Card className="border shadow-sm mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Database className="h-4 w-4 mr-2" />
          Cloud-Based AI Connector Tech Stack
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <TechItem 
              icon={<Brain className="h-8 w-8 text-primary" />}
              title="AI Processing"
              description="OpenAI + Pandas for formula analysis and optimization"
              bullets={[
                "Formula error detection",
                "Auto-optimized calculations",
                "Pattern recognition for insights"
              ]}
            />
            
            <TechItem 
              icon={<ArrowUpDown className="h-8 w-8 text-primary" />}
              title="API Connectivity"
              description="Flask/Django API connects Excel to NuLedger"
              bullets={[
                "Secure file processing",
                "Two-way data synchronization",
                "Multi-format export options"
              ]}
            />
            
            <TechItem 
              icon={<Database className="h-8 w-8 text-primary" />}
              title="Visualization"
              description="Power BI Embedded for interactive dashboards"
              bullets={[
                "Live data visualization",
                "Custom financial reports",
                "Trend analysis and forecasting"
              ]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface TechItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
}

const TechItem: React.FC<TechItemProps> = ({ icon, title, description, bullets }) => {
  return (
    <div className="border rounded-md p-4">
      <div className="flex flex-col items-center md:items-start">
        <div className="mb-3">{icon}</div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3 text-center md:text-left">{description}</p>
        <ul className="space-y-1 text-sm">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TechStackInfo;
