
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const MigrationWizard = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [migrationSource, setMigrationSource] = useState<string>("");
  const [selectedDataSets, setSelectedDataSets] = useState<string[]>([]);

  const handleNextStep = () => {
    if (currentStep === 1 && !migrationSource) {
      toast({
        title: "Migration Source Required",
        description: "Please select a data source to continue",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 2 && selectedDataSets.length === 0) {
      toast({
        title: "Data Selection Required",
        description: "Please select at least one data type to migrate",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit final migration
      toast({
        title: "Migration Initiated",
        description: "Your data migration process has started. You can monitor progress in the Migration History tab.",
      });
      
      // Reset wizard
      setCurrentStep(1);
      setMigrationSource("");
      setSelectedDataSets([]);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleDataSet = (dataSet: string) => {
    if (selectedDataSets.includes(dataSet)) {
      setSelectedDataSets(selectedDataSets.filter(ds => ds !== dataSet));
    } else {
      setSelectedDataSets([...selectedDataSets, dataSet]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Migration Wizard</CardTitle>
        <CardDescription>
          Follow the steps below to set up and execute your data migration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <div className="flex justify-between relative">
            {[1, 2, 3, 4].map((step) => (
              <StepIndicator 
                key={step}
                step={step} 
                label={getStepLabel(step)}
                active={step === currentStep}
                completed={step < currentStep}
              />
            ))}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
          </div>
        </div>

        <div className="py-4">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Select Data Source</h3>
                <p className="text-muted-foreground mb-6">
                  Choose the system you want to migrate data from
                </p>
              </div>
              
              <div>
                <Label htmlFor="source">Data Source</Label>
                <Select value={migrationSource} onValueChange={setMigrationSource}>
                  <SelectTrigger id="source" className="w-full">
                    <SelectValue placeholder="Select source system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quickbooks">QuickBooks Desktop</SelectItem>
                    <SelectItem value="quickbooks-online">QuickBooks Online</SelectItem>
                    <SelectItem value="xero">Xero</SelectItem>
                    <SelectItem value="sage">Sage</SelectItem>
                    <SelectItem value="freshbooks">FreshBooks</SelectItem>
                    <SelectItem value="wave">Wave</SelectItem>
                    <SelectItem value="excel">Excel/CSV Files</SelectItem>
                    <SelectItem value="other">Other System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {migrationSource === 'other' && (
                <div className="mt-4">
                  <Label htmlFor="other-source">Specify Source System</Label>
                  <Input id="other-source" placeholder="Enter source system name" />
                </div>
              )}
              
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
                  <InfoIcon className="h-4 w-4 mr-2" />
                  Migration Tip
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  For optimal results, ensure you have administrator access to your source system. This will allow for complete data extraction during the migration process.
                </p>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Select Data to Migrate</h3>
                <p className="text-muted-foreground mb-6">
                  Choose which data sets you want to include in the migration
                </p>
              </div>
              
              <div className="space-y-4">
                <DataSetOption 
                  id="chart-of-accounts" 
                  label="Chart of Accounts" 
                  description="Account structure, categories, and hierarchy"
                  checked={selectedDataSets.includes("chart-of-accounts")}
                  onCheckedChange={() => toggleDataSet("chart-of-accounts")}
                />
                
                <DataSetOption 
                  id="client-data" 
                  label="Client Data" 
                  description="Client profiles, contacts, and settings"
                  checked={selectedDataSets.includes("client-data")}
                  onCheckedChange={() => toggleDataSet("client-data")}
                />
                
                <DataSetOption 
                  id="transactions" 
                  label="Historical Transactions" 
                  description="Financial transactions, journal entries, and reconciliations"
                  checked={selectedDataSets.includes("transactions")}
                  onCheckedChange={() => toggleDataSet("transactions")}
                />
                
                <DataSetOption 
                  id="vendors" 
                  label="Vendor Information" 
                  description="Vendor profiles, payment terms, and history"
                  checked={selectedDataSets.includes("vendors")}
                  onCheckedChange={() => toggleDataSet("vendors")}
                />
                
                <DataSetOption 
                  id="employees" 
                  label="Employee Records" 
                  description="Employee profiles and payroll information"
                  checked={selectedDataSets.includes("employees")}
                  onCheckedChange={() => toggleDataSet("employees")}
                />
                
                <DataSetOption 
                  id="tax-data" 
                  label="Tax Information" 
                  description="Tax rates, filing history, and compliance data"
                  checked={selectedDataSets.includes("tax-data")}
                  onCheckedChange={() => toggleDataSet("tax-data")}
                />
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Data Mapping Configuration</h3>
                <p className="text-muted-foreground mb-6">
                  Configure how your data should map to NuLedger fields
                </p>
              </div>
              
              <Tabs defaultValue="auto" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="auto">Automatic Mapping</TabsTrigger>
                  <TabsTrigger value="custom">Custom Mapping</TabsTrigger>
                </TabsList>
                
                <TabsContent value="auto">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Automatic Field Detection</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        NuLedger's AI will analyze your source data and automatically map fields to the closest matching fields in our system.
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="review-mapping" />
                        <Label htmlFor="review-mapping" className="text-sm">
                          I want to review the automatic mapping before final import
                        </Label>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Conflict Resolution Strategy</h4>
                      <Select defaultValue="newer">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newer">Use newer if conflict exists</SelectItem>
                          <SelectItem value="source">Prefer source data</SelectItem>
                          <SelectItem value="target">Prefer existing data</SelectItem>
                          <SelectItem value="manual">Resolve manually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="custom">
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Custom Mapping Instructions</h4>
                      <p className="text-sm text-muted-foreground">
                        For each data type selected, you'll need to map source fields to destination fields.
                        Download our field mapping template to provide your custom mappings.
                      </p>
                    </div>
                    
                    <div className="flex justify-center p-6 border border-dashed rounded-md">
                      <div className="text-center">
                        <div className="mb-4">
                          <DownloadIcon className="h-10 w-10 text-muted-foreground mx-auto" />
                        </div>
                        <h4 className="font-medium mb-2">Download & Upload Mapping Template</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Download our Excel template, fill it with your field mappings, then upload it back
                        </p>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            Download Template
                          </Button>
                          <Button size="sm">
                            Upload Mapping
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Migration Validation & Execution</h3>
                <p className="text-muted-foreground mb-6">
                  Review your migration settings and initiate the migration process
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted px-4 py-2 border-b font-medium">
                    Migration Summary
                  </div>
                  <div className="p-4 space-y-3">
                    <SummaryItem 
                      label="Source System" 
                      value={getSourceSystemName(migrationSource)} 
                    />
                    <SummaryItem 
                      label="Selected Data Types" 
                      value={`${selectedDataSets.length} data types selected`} 
                    />
                    <SummaryItem 
                      label="Mapping Method" 
                      value="Automatic with review" 
                    />
                    <SummaryItem 
                      label="Estimated Time" 
                      value="30-45 minutes" 
                    />
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Migration Options</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="test-migration" defaultChecked />
                      <Label htmlFor="test-migration">
                        Perform test migration before final import
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="backup" defaultChecked />
                      <Label htmlFor="backup">
                        Create backup of current data before migration
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifications" defaultChecked />
                      <Label htmlFor="notifications">
                        Receive email notifications about migration progress
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md border border-amber-200 dark:border-amber-800">
                  <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center">
                    <AlertIcon className="h-4 w-4 mr-2" />
                    Important Note
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    The migration process may take some time depending on the amount of data. Your system will remain fully functional during migration, but some reports may show incomplete data until the process is complete.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button onClick={handleNextStep}>
          {currentStep < 4 ? 'Next' : 'Start Migration'}
        </Button>
      </CardFooter>
    </Card>
  );
};

interface StepIndicatorProps {
  step: number;
  label: string;
  active: boolean;
  completed: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ step, label, active, completed }) => {
  return (
    <div className="flex flex-col items-center relative">
      <div 
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          active 
            ? 'bg-primary text-primary-foreground' 
            : completed 
              ? 'bg-primary/20 text-primary' 
              : 'bg-muted text-muted-foreground'
        }`}
      >
        {completed ? <CheckIcon className="h-4 w-4" /> : step}
      </div>
      <span className={`text-xs mt-2 text-center w-16 ${active ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
        {label}
      </span>
    </div>
  );
};

interface DataSetOptionProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
}

const DataSetOption: React.FC<DataSetOptionProps> = ({ 
  id, 
  label, 
  description, 
  checked, 
  onCheckedChange 
}) => {
  return (
    <div className={`p-3 border rounded-md flex items-start space-x-3 ${checked ? 'border-primary bg-primary/5' : ''}`}>
      <Checkbox 
        id={id} 
        checked={checked} 
        onCheckedChange={onCheckedChange} 
        className="mt-0.5"
      />
      <div>
        <Label htmlFor={id} className="font-medium">{label}</Label>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
};

interface SummaryItemProps {
  label: string;
  value: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

// Helper functions
const getStepLabel = (step: number): string => {
  switch (step) {
    case 1: return 'Source';
    case 2: return 'Data';
    case 3: return 'Mapping';
    case 4: return 'Execute';
    default: return '';
  }
};

const getSourceSystemName = (source: string): string => {
  switch (source) {
    case 'quickbooks': return 'QuickBooks Desktop';
    case 'quickbooks-online': return 'QuickBooks Online';
    case 'xero': return 'Xero';
    case 'sage': return 'Sage';
    case 'freshbooks': return 'FreshBooks';
    case 'wave': return 'Wave';
    case 'excel': return 'Excel/CSV Files';
    case 'other': return 'Custom System';
    default: return 'Not Selected';
  }
};

// Icons
const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const AlertIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default MigrationWizard;
