import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, XCircle, Download, FileText, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ValidationJob {
  id: string;
  job_type: string;
  status: string;
  records_total: number;
  records_success: number;
  records_skipped: number;
  records_failed: number;
  error_logs: any;
  skip_reasons: Record<string, number>;
  started_at: string;
  completed_at: string;
}

interface ValidationRecord {
  id: string;
  filevine_id: string;
  nuledger_id: string;
  record_type: string;
  status: string;
  error_message: string;
  skip_reason: string;
}

const DataValidationReport: React.FC = () => {
  const [validationJobs, setValidationJobs] = useState<ValidationJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<ValidationJob | null>(null);
  const [validationRecords, setValidationRecords] = useState<ValidationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValidationJobs();
  }, []);

  const loadValidationJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('migration_jobs')
        .select('*')
        .in('status', ['success', 'failed', 'partial'])
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setValidationJobs((data || []) as ValidationJob[]);
      
      if (data && data.length > 0) {
        setSelectedJob(data[0] as ValidationJob);
        loadValidationRecords(data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load validation jobs');
    } finally {
      setLoading(false);
    }
  };

  const loadValidationRecords = async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('migration_records')
        .select('*')
        .eq('migration_job_id', jobId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setValidationRecords(data || []);
    } catch (error) {
      toast.error('Failed to load validation records');
    }
  };

  const handleJobSelect = (job: ValidationJob) => {
    setSelectedJob(job);
    loadValidationRecords(job.id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Success
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case 'skipped':
        return (
          <Badge variant="secondary">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Skipped
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Partial
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const calculateSuccessRate = (job: ValidationJob) => {
    if (job.records_total === 0) return 0;
    return Math.round((job.records_success / job.records_total) * 100);
  };

  const handleExportReport = async (format: 'csv' | 'pdf') => {
    if (!selectedJob) return;
    
    // In a real implementation, this would generate and download the report
    toast.success(`${format.toUpperCase()} report export started`);
  };

  if (loading) {
    return <div className="p-6">Loading validation reports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Job Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {validationJobs.map((job) => (
              <div
                key={job.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedJob?.id === job.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-muted-foreground'
                }`}
                onClick={() => handleJobSelect(job)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">
                    {job.job_type.replace('_', ' ')}
                  </span>
                  {getStatusBadge(job.status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(job.started_at).toLocaleDateString()}
                </div>
                <div className="mt-2">
                  <Progress 
                    value={calculateSuccessRate(job)} 
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {job.records_success}/{job.records_total} records
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validation Report */}
      {selectedJob && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Validation Report
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleExportReport('csv')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={() => handleExportReport('pdf')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {selectedJob.records_success}
                </p>
                <p className="text-sm text-muted-foreground">
                  Successfully Migrated
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <AlertTriangle className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                <p className="text-2xl font-bold text-yellow-600">
                  {selectedJob.records_skipped}
                </p>
                <p className="text-sm text-muted-foreground">
                  Records Skipped
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <XCircle className="w-8 h-8 mx-auto text-red-600 mb-2" />
                <p className="text-2xl font-bold text-red-600">
                  {selectedJob.records_failed}
                </p>
                <p className="text-sm text-muted-foreground">
                  Records Failed
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold mb-2">
                  {calculateSuccessRate(selectedJob)}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Success Rate
                </p>
              </div>
            </div>

            {/* Detailed Records Table */}
            <div>
              <h4 className="font-medium mb-4">Detailed Records</h4>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filevine ID</TableHead>
                      <TableHead>NuLedger ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationRecords.slice(0, 10).map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono">
                          {record.filevine_id}
                        </TableCell>
                        <TableCell className="font-mono">
                          {record.nuledger_id || '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {record.record_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(record.status)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {record.error_message || record.skip_reason || '—'}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {validationRecords.length > 10 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Showing 10 of {validationRecords.length} records. 
                  Export full report for complete details.
                </p>
              )}
            </div>

            {/* Skip Reasons Summary */}
            {selectedJob.skip_reasons && Object.keys(selectedJob.skip_reasons).length > 0 && (
              <div>
                <h4 className="font-medium mb-4">Skip Reasons Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedJob.skip_reasons).map(([reason, count]) => (
                    <div key={reason} className="p-3 border rounded-lg">
                      <p className="font-medium">{reason}</p>
                      <p className="text-sm text-muted-foreground">
                        {String(count)} records
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {validationJobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No Validation Reports</p>
            <p className="text-muted-foreground">
              Run a migration to generate validation reports
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataValidationReport;