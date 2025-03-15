import React from 'react';
import { Download, Eye, File, FileBox, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Client, ClientDocument } from '@/types/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ClientDocumentsProps {
  client: Client;
}

const ClientDocuments: React.FC<ClientDocumentsProps> = ({ client }) => {
  const documents = client.documents || [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Client Documents</h3>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-1" />
          Upload Document
        </Button>
      </div>
      
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <FileBox className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">No Documents</h3>
            <p className="text-center text-muted-foreground mb-4">
              No documents have been uploaded for this client yet.
            </p>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              Upload First Document
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Document Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <DocumentRequirement 
              title="Tax Return Documents" 
              description="Documents needed for annual tax filing" 
              status={documents.some(d => d.type === 'tax') ? 'complete' : 'pending'} 
            />
            <DocumentRequirement 
              title="Financial Statements" 
              description="Financial reports and statements" 
              status={documents.some(d => d.type === 'financial') ? 'complete' : 'pending'} 
            />
            <DocumentRequirement 
              title="Legal Documents" 
              description="Contracts and legal paperwork" 
              status={documents.some(d => d.type === 'legal') ? 'complete' : 'pending'} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface DocumentCardProps {
  document: ClientDocument;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className={cn(
            "h-10 w-10 rounded-md flex items-center justify-center mr-3",
            document.type === 'tax' 
              ? "bg-green-100 text-green-700" 
              : document.type === 'financial'
                ? "bg-blue-100 text-blue-700"
                : document.type === 'legal'
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700"
          )}>
            {document.type === 'tax' ? (
              <FileText className="h-5 w-5" />
            ) : document.type === 'financial' ? (
              <File className="h-5 w-5" />
            ) : (
              <File className="h-5 w-5" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-sm">{document.name}</h4>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-muted-foreground">
                    {new Date(document.dateUploaded).toLocaleDateString()} • {formatFileSize(document.size)}
                  </span>
                  <Badge variant="outline" className="ml-2 text-xs py-0 h-4">
                    {document.type}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <span className="mr-2">{document.name}</span>
                        <Badge variant="outline">{document.type}</Badge>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="bg-muted aspect-[4/3] rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Document preview would appear here</p>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DocumentRequirementProps {
  title: string;
  description: string;
  status: 'complete' | 'pending';
}

const DocumentRequirement: React.FC<DocumentRequirementProps> = ({ title, description, status }) => {
  return (
    <div className="flex items-start">
      <div className={cn(
        "h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center mr-3",
        status === 'complete' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
      )}>
        {status === 'complete' ? (
          <FileText className="h-4 w-4" />
        ) : (
          <File className="h-4 w-4" />
        )}
      </div>
      <div>
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-medium">{title}</h4>
          <Badge variant={status === 'complete' ? 'default' : 'outline'} className={cn(
            "text-xs",
            status === 'complete' && "bg-green-500"
          )}>
            {status === 'complete' ? 'Complete' : 'Pending'}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

export default ClientDocuments;
