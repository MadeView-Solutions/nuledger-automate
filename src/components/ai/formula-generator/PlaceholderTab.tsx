
import React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, BarChart2, Lightbulb } from "lucide-react";

interface PlaceholderTabProps {
  icon: "report" | "analysis" | "insights";
  title: string;
  description: string;
  buttonText: string;
}

const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ icon, title, description, buttonText }) => {
  const getIcon = () => {
    switch (icon) {
      case "report":
        return <FileSpreadsheet className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />;
      case "analysis":
        return <BarChart2 className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />;
      case "insights":
        return <Lightbulb className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="text-center py-6">
      {getIcon()}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {description}
      </p>
      <Button className="mx-auto">
        {buttonText}
      </Button>
    </div>
  );
};

export default PlaceholderTab;
