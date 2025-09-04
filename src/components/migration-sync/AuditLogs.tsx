import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, AlertTriangle, XCircle, Download, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MigrationJob {
  id: string;
  job_type: string;
  data_categories: string[];
  status: string;
  records_total: number;
  records_success: number;
  records_skipped: number;
  records_failed: number;
  started_at: string;
  completed_at: string;
  created_by: string;
}

const AuditLogs: React.FC = () => {
  const [migrationJobs, setMigrationJobs] = useState<MigrationJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<MigrationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    loadMigrationJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [migrationJobs, searchTerm, statusFilter, typeFilter]);

  const loadMigrationJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('migration_jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMigrationJobs(data || []);
    } catch (error) {
      toast.error('Failed to load migration jobs');
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = migrationJobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.job_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.data_categories.some(cat => 
          cat.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(job => job.job_type === typeFilter);
    }

    setFilteredJobs(filtered);
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
      case 'partial':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Partial Success
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            Pending
          </Badge>
        );
      case 'running':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Running
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDuration = (startDate: string, endDate: string | null) => {
    if (!endDate) return "In Progress";
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = end.getTime() - start.getTime();
    
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const handleDownloadLog = async (jobId: string) => {
    // In a real implementation, this would generate and download the log file
    toast.success('Log download started');
  };

  const handleViewDetails = (jobId: string) => {
    // Navigate to detailed view or open modal
    toast.info('Opening job details...');
  };

  if (loading) {
    return <div className="p-6">Loading audit logs...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter Migration Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="initial_import">Initial Import</SelectItem>
                  <SelectItem value="ongoing_sync">Ongoing Sync</SelectItem>
                  <SelectItem value="manual_sync">Manual Sync</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Migration Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Job History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Records Imported</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Log</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(job.started_at).toLocaleDateString()}
                        <br />
                        <span className="text-muted-foreground">
                          {new Date(job.started_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {job.job_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {job.data_categories.slice(0, 2).map((category) => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category.replace('_', ' ')}
                          </Badge>
                        ))}
                        {job.data_categories.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{job.data_categories.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{job.records_total.toLocaleString()}</div>
                        <div className="text-muted-foreground text-xs">
                          ✅ {job.records_success} 
                          {job.records_skipped > 0 && ` ⚠️ ${job.records_skipped}`}
                          {job.records_failed > 0 && ` ❌ ${job.records_failed}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(job.status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(job.started_at, job.completed_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadLog(job.id)}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(job.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {migrationJobs.length === 0 
                  ? "No migration jobs found. Start your first migration to see logs here."
                  : "No jobs match your current filters."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;