
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data for migration history
const migrationHistory = [
  {
    id: "mig-001",
    name: "Initial QuickBooks Import",
    source: "QuickBooks Online",
    date: "2023-09-15T10:30:00Z",
    status: "completed" as const,
    records: 1243,
    duration: "45m",
  },
  {
    id: "mig-002",
    name: "Client Data Update",
    source: "Excel Import",
    date: "2023-10-05T14:20:00Z",
    status: "completed" as const,
    records: 156,
    duration: "12m",
  },
  {
    id: "mig-003",
    name: "Financial Transactions Migration",
    source: "Xero",
    date: "2023-11-20T09:15:00Z",
    status: "failed" as const,
    records: 0,
    duration: "5m",
  },
  {
    id: "mig-004",
    name: "Tax Data Import",
    source: "CSV Upload",
    date: "2023-12-10T16:40:00Z", 
    status: "in-progress" as const,
    records: 450,
    duration: "10m+",
  },
];

const MigrationHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Migration History</CardTitle>
        <CardDescription>
          View and manage your previous data migration activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left font-medium px-4 py-3">Migration</th>
                <th className="text-left font-medium px-4 py-3">Source</th>
                <th className="text-left font-medium px-4 py-3">Date</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-left font-medium px-4 py-3">Records</th>
                <th className="text-left font-medium px-4 py-3">Duration</th>
                <th className="text-left font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {migrationHistory.map((migration) => (
                <tr key={migration.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3">{migration.name}</td>
                  <td className="px-4 py-3">{migration.source}</td>
                  <td className="px-4 py-3">{formatDate(migration.date)}</td>
                  <td className="px-4 py-3">
                    <MigrationStatusBadge status={migration.status} />
                  </td>
                  <td className="px-4 py-3">{migration.records.toLocaleString()}</td>
                  <td className="px-4 py-3">{migration.duration}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      {migration.status === "failed" && (
                        <Button size="sm">Retry</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

interface MigrationStatusBadgeProps {
  status: 'completed' | 'failed' | 'in-progress' | 'queued';
}

const MigrationStatusBadge: React.FC<MigrationStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500">Completed</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    case 'in-progress':
      return <Badge className="bg-blue-500">In Progress</Badge>;
    case 'queued':
      return <Badge variant="outline">Queued</Badge>;
    default:
      return null;
  }
};

// Helper functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default MigrationHistory;
