
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play, RefreshCw, XCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data for processing queue
const queueItems = [
  {
    id: "doc-1",
    filename: "invoice-acme-corp.pdf",
    status: "processing" as const,
    progress: 67,
    uploadedAt: "2023-07-21T15:45:00Z"
  },
  {
    id: "doc-2",
    filename: "receipt-office-supplies.jpg",
    status: "queued" as const,
    progress: 0,
    uploadedAt: "2023-07-21T15:48:30Z"
  },
  {
    id: "doc-3",
    filename: "statement-q2-2023.pdf",
    status: "error" as const,
    progress: 23,
    error: "Low image quality - manual review required",
    uploadedAt: "2023-07-21T15:50:10Z"
  },
  {
    id: "doc-4",
    filename: "expense-report-june.pdf",
    status: "complete" as const,
    progress: 100,
    uploadedAt: "2023-07-21T15:30:00Z"
  }
];

const ProcessingQueue = () => {
  const { toast } = useToast();

  const handlePauseQueue = () => {
    toast({
      title: "Queue Paused",
      description: "Document processing queue has been paused",
    });
  };

  const handleResumeQueue = () => {
    toast({
      title: "Queue Resumed",
      description: "Document processing queue has been resumed",
    });
  };

  const handleRetry = (id: string) => {
    toast({
      title: "Retrying Document",
      description: `Retrying processing for document ${id}`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Processing Queue</CardTitle>
          <CardDescription>
            Monitor real-time document processing status
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePauseQueue}>
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
          <Button size="sm" onClick={handleResumeQueue}>
            <Play className="h-4 w-4 mr-2" />
            Resume
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {queueItems.map((item) => (
            <QueueItem 
              key={item.id}
              item={item}
              onRetry={() => handleRetry(item.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface QueueItemProps {
  item: {
    id: string;
    filename: string;
    status: "queued" | "processing" | "complete" | "error";
    progress: number;
    uploadedAt: string;
    error?: string;
  };
  onRetry: () => void;
}

const QueueItem: React.FC<QueueItemProps> = ({ item, onRetry }) => {
  const getStatusIcon = () => {
    switch (item.status) {
      case "processing":
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Pause className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (item.status) {
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "complete":
        return <Badge className="bg-green-500">Complete</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Queued</Badge>;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        {getStatusIcon()}
        <div>
          <div className="flex items-center">
            <h3 className="font-medium truncate max-w-[200px] md:max-w-sm">{item.filename}</h3>
            <div className="ml-2">{getStatusBadge()}</div>
          </div>
          <div className="flex space-x-2 items-center mt-1">
            <p className="text-xs text-muted-foreground">
              Uploaded {new Date(item.uploadedAt).toLocaleString()}
            </p>
            {item.status === "error" && (
              <p className="text-xs text-red-500">{item.error}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {item.status === "processing" && (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300" 
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <span className="text-xs font-medium">{item.progress}%</span>
          </div>
        )}
        
        {item.status === "error" && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            <RefreshCw className="h-3 w-3 mr-1" /> Retry
          </Button>
        )}
        
        {item.status === "queued" && (
          <Button size="sm" variant="ghost">
            <XCircle className="h-3 w-3 mr-1" /> Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProcessingQueue;
