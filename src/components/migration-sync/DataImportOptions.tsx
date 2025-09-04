import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Upload, FileUp, Database, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DataImportOptionsProps {}

const DataImportOptions: React.FC<DataImportOptionsProps> = () => {
  const [isInitialMigration, setIsInitialMigration] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [syncFrequency, setSyncFrequency] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const dataCategories = [
    { id: "settlements", label: "Settlements", description: "Settlement amounts and details" },
    { id: "client_intake", label: "Client Intake", description: "Client information and case details" },
    { id: "invoices", label: "Invoices", description: "Billing and invoice data" },
    { id: "negotiator_performance", label: "Negotiator Performance", description: "Attorney and negotiator metrics" },
    { id: "case_notes", label: "Case Notes", description: "Case documentation and notes" },
    { id: "documents", label: "Documents", description: "Case-related documents and files" },
    { id: "contacts", label: "Contacts", description: "Client and contact information" },
    { id: "expenses", label: "Expenses", description: "Case expenses and costs" }
  ];

  useEffect(() => {
    loadSyncConfig();
  }, []);

  const loadSyncConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('sync_config')
        .select('*')
        .limit(1)
        .single();
      
      if (!error && data) {
        setAutoSyncEnabled(data.auto_sync_enabled);
        setSyncFrequency(data.sync_frequency);
      }
    } catch (error) {
      console.log('No sync config found');
    }
  };

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  const handleAutoSyncToggle = async (enabled: boolean) => {
    setAutoSyncEnabled(enabled);
    
    try {
      await supabase
        .from('sync_config')
        .upsert({ 
          auto_sync_enabled: enabled,
          sync_frequency: syncFrequency
        });
      
      toast.success(`Auto-sync ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update sync settings');
    }
  };

  const handleSyncFrequencyChange = async (frequency: string) => {
    setSyncFrequency(frequency);
    
    try {
      await supabase
        .from('sync_config')
        .upsert({
          auto_sync_enabled: autoSyncEnabled,
          sync_frequency: frequency
        });
      
      toast.success('Sync frequency updated');
    } catch (error) {
      toast.error('Failed to update sync frequency');
    }
  };

  const handleStartMigration = async () => {
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one data category');
      return;
    }

    setIsRunning(true);
    
    try {
      // Create migration job record
      const { data: job, error } = await supabase
        .from('migration_jobs')
        .insert({
          job_type: isInitialMigration ? 'initial_import' : 'manual_sync',
          data_categories: selectedCategories,
          date_range_start: startDate || null,
          date_range_end: endDate || null,
          status: 'running'
        })
        .select()
        .single();

      if (error) throw error;

      // Simulate migration process (in real implementation, this would call Filevine API)
      setTimeout(async () => {
        const success = Math.floor(Math.random() * 900) + 100; // Random success count
        const failed = Math.floor(Math.random() * 50); // Random failure count
        const skipped = Math.floor(Math.random() * 20); // Random skipped count

        await supabase
          .from('migration_jobs')
          .update({
            status: failed > 10 ? 'partial' : 'success',
            records_success: success,
            records_failed: failed,
            records_skipped: skipped,
            records_total: success + failed + skipped,
            completed_at: new Date().toISOString()
          })
          .eq('id', job.id);

        setIsRunning(false);
        toast.success(`Migration completed: ${success} records processed successfully`);
        
        if (failed > 0) {
          toast.warning(`${failed} records failed to process`);
        }
      }, 3000);

      toast.success('Migration started successfully');
    } catch (error) {
      setIsRunning(false);
      toast.error('Failed to start migration');
    }
  };

  return (
    <div className="space-y-6">
      {/* Migration Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Migration Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button
              variant={isInitialMigration ? "default" : "outline"}
              onClick={() => setIsInitialMigration(true)}
              className="flex-1"
            >
              Initial Migration
            </Button>
            <Button
              variant={!isInitialMigration ? "default" : "outline"}
              onClick={() => setIsInitialMigration(false)}
              className="flex-1"
            >
              Manual Sync
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {isInitialMigration 
              ? "One-time import of historical data from Filevine"
              : "Manual synchronization of recent changes"
            }
          </p>
        </CardContent>
      </Card>

      {/* Date Range Selection */}
      {isInitialMigration && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Date Range
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Categories Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Data Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataCategories.map((category) => (
              <div key={category.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => 
                    handleCategoryToggle(category.id, checked as boolean)
                  }
                />
                <div className="flex-1">
                  <Label 
                    htmlFor={category.id} 
                    className="font-medium cursor-pointer"
                  >
                    {category.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ongoing Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Ongoing Sync Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoSync" className="text-base font-medium">
                Enable Auto-Sync
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically sync data changes every 24 hours
              </p>
            </div>
            <Switch
              id="autoSync"
              checked={autoSyncEnabled}
              onCheckedChange={handleAutoSyncToggle}
            />
          </div>

          {autoSyncEnabled && (
            <div className="space-y-2">
              <Label>Sync Frequency</Label>
              <Select value={syncFrequency} onValueChange={handleSyncFrequencyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Every Hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CSV/XLSX Upload Fallback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileUp className="w-5 h-5 mr-2" />
            Manual File Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Upload CSV/XLSX Files</p>
            <p className="text-sm text-muted-foreground mb-4">
              Alternative method for importing data when API access is not available
            </p>
            <Button variant="outline">
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Start Migration Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleStartMigration}
          disabled={isRunning || selectedCategories.length === 0}
          size="lg"
        >
          {isRunning ? "Migration in Progress..." : "Start Migration"}
        </Button>
      </div>
    </div>
  );
};

export default DataImportOptions;