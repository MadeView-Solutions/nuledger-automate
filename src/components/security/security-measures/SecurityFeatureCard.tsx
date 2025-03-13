
import React, { ReactNode } from "react";

interface SecurityFeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconBgClass: string;
}

const SecurityFeatureCard: React.FC<SecurityFeatureCardProps> = ({
  icon,
  title,
  description,
  iconBgClass,
}) => {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border">
      <div className={`rounded-full p-2 ${iconBgClass}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export default SecurityFeatureCard;
