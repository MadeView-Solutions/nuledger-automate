import React from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  ClipboardList, 
  DollarSign, 
  FileText, 
  FolderCheck
} from 'lucide-react';
import { Client } from '@/types/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClientWorkflowProps {
  client: Client;
}

const ClientWorkflow: React.FC<ClientWorkflowProps> = ({ client }) => {
  // Determine client type-specific workflows
  const isBusinessClient = client.type === 'business';
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Client Accounting Workflow</h3>
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-border" />
          
          {/* Workflow steps */}
          <div className="space-y-8">
            {/* Client Onboarding */}
            <WorkflowStep 
              title="Client Onboarding" 
              description="Collect all necessary documents and client information"
              icon={<ClipboardList className="h-5 w-5" />}
              status="completed"
            >
              <div className="text-sm space-y-2">
                <p>✓ Collected contact information</p>
                <p>✓ Signed engagement letter</p>
                <p>✓ Completed client intake form</p>
                {isBusinessClient && <p>✓ Received business formation documents</p>}
              </div>
            </WorkflowStep>
            
            {/* Setup Accounting System */}
            <WorkflowStep 
              title="Setup Accounting System" 
              description="Configure accounting software and initial setup"
              icon={<FolderCheck className="h-5 w-5" />}
              status="completed"
            >
              <div className="text-sm space-y-2">
                <p>✓ Created chart of accounts</p>
                {isBusinessClient && <p>✓ Imported historical transactions</p>}
                <p>✓ Setup reporting templates</p>
              </div>
            </WorkflowStep>
            
            {/* Monthly Bookkeeping */}
            <WorkflowStep 
              title="Monthly Bookkeeping" 
              description="Regular financial record keeping and reconciliation"
              icon={<DollarSign className="h-5 w-5" />}
              status="in-progress"
            >
              <div className="text-sm space-y-2">
                <p>✓ Bank reconciliation</p>
                <p>✓ Record income and expenses</p>
                <p>◯ Generate monthly financial statements</p>
                {isBusinessClient && <p>◯ Reconcile accounts payable/receivable</p>}
              </div>
            </WorkflowStep>
            
            {/* Tax Planning */}
            <WorkflowStep 
              title="Tax Planning" 
              description="Proactive tax strategy and optimization"
              icon={<FileText className="h-5 w-5" />}
              status="upcoming"
            >
              <div className="text-sm space-y-2">
                <p>◯ Quarterly tax projections</p>
                <p>◯ Tax saving recommendations</p>
                {isBusinessClient && <p>◯ Business deduction analysis</p>}
              </div>
            </WorkflowStep>
            
            {/* Tax Preparation & Filing */}
            <WorkflowStep 
              title="Tax Preparation & Filing" 
              description="Annual tax return preparation and submission"
              icon={<CalendarDays className="h-5 w-5" />}
              status="upcoming"
            >
              <div className="text-sm space-y-2">
                <p>◯ Gather tax documents</p>
                <p>◯ Prepare tax returns</p>
                <p>◯ Review with client</p>
                <p>◯ File with tax authorities</p>
              </div>
            </WorkflowStep>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Upcoming Deliverables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 text-amber-700 p-1.5 rounded-full">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm">Monthly Financial Statement</p>
                <p className="text-xs text-muted-foreground">Due on {getNextMonthDate()}</p>
              </div>
            </div>
            
            {isBusinessClient && (
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-700 p-1.5 rounded-full">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Quarterly Sales Tax Filing</p>
                  <p className="text-xs text-muted-foreground">Due on {getQuarterlyDate()}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 text-green-700 p-1.5 rounded-full">
                <ClipboardList className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm">Tax Planning Meeting</p>
                <p className="text-xs text-muted-foreground">Schedule by {getTaxPlanningDate()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface WorkflowStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'in-progress' | 'upcoming';
  children?: React.ReactNode;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ 
  title, 
  description, 
  icon, 
  status, 
  children 
}) => {
  return (
    <div className="relative flex">
      {/* Step icon */}
      <div className={`z-10 flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
        status === 'completed' 
          ? 'bg-green-100 text-green-700'
          : status === 'in-progress'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-muted text-muted-foreground'
      }`}>
        {status === 'completed' ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          icon
        )}
      </div>
      
      {/* Step content */}
      <div className="ml-4">
        <h4 className="text-base font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        {children && (
          <div className="bg-muted/40 rounded-md p-3 mt-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions to generate dates for demo purposes
const getNextMonthDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(15);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getQuarterlyDate = () => {
  const date = new Date();
  const currentMonth = date.getMonth();
  // Set to end of quarter
  if (currentMonth < 3) date.setMonth(3);
  else if (currentMonth < 6) date.setMonth(6);
  else if (currentMonth < 9) date.setMonth(9);
  else date.setMonth(12);
  date.setDate(15);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getTaxPlanningDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default ClientWorkflow;
