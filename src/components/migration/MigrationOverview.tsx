
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MigrationOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MigrationStatsCard 
        title="Migration Status" 
        value="Ready"
        description="Your system is ready for data migration"
        color="green"
      />
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">Migration Process</h3>
          <div className="space-y-3">
            <ProcessStep 
              step={1} 
              label="Scoping & Planning" 
              status="completed" 
              progress={100} 
            />
            <ProcessStep 
              step={2} 
              label="Data Mapping" 
              status="in-progress" 
              progress={60} 
            />
            <ProcessStep 
              step={3} 
              label="Test Migration" 
              status="pending" 
              progress={0} 
            />
            <ProcessStep 
              step={4} 
              label="Validation & Review" 
              status="pending" 
              progress={0} 
            />
            <ProcessStep 
              step={5} 
              label="Final Migration" 
              status="pending" 
              progress={0} 
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-2">Migration Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Data Mapped:</span>
              <span className="font-medium">65%</span>
            </div>
            <Progress value={65} className="h-2" />
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-muted rounded p-2">
                <div className="text-xs text-muted-foreground">Templates Downloaded</div>
                <div className="font-semibold">6/8</div>
              </div>
              <div className="bg-muted rounded p-2">
                <div className="text-xs text-muted-foreground">Files Uploaded</div>
                <div className="font-semibold">3/8</div>
              </div>
              <div className="bg-muted rounded p-2">
                <div className="text-xs text-muted-foreground">Records Processed</div>
                <div className="font-semibold">1,243</div>
              </div>
              <div className="bg-muted rounded p-2">
                <div className="text-xs text-muted-foreground">Time Remaining</div>
                <div className="font-semibold">~2 days</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface MigrationStatsCardProps {
  title: string;
  value: string;
  description: string;
  color: 'green' | 'amber' | 'red' | 'blue';
}

const MigrationStatsCard: React.FC<MigrationStatsCardProps> = ({ 
  title, 
  value, 
  description,
  color
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'amber': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'red': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'blue': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-medium mb-1">{title}</h3>
        <div className="flex items-center space-x-2 mt-2">
          <div className={`px-2 py-1 rounded-md text-sm font-medium ${getColorClass()}`}>
            {value}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
        
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm">
            <strong>Next Step:</strong> Complete data mapping for all modules
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ProcessStepProps {
  step: number;
  label: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ step, label, status, progress }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return (
          <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white">
            <CheckIcon className="h-3 w-3" />
          </div>
        );
      case 'in-progress':
        return (
          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {step}
          </div>
        );
      case 'pending':
        return (
          <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            {step}
          </div>
        );
    }
  };
  
  return (
    <div className="flex items-center space-x-3">
      {getStatusIcon()}
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className={status === 'pending' ? 'text-muted-foreground' : ''}>{label}</span>
          <span className="text-xs">{progress}%</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default MigrationOverview;
