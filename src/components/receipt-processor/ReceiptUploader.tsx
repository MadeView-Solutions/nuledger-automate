
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FileUp, Camera, Receipt, Upload, RefreshCw } from "lucide-react";
import ProcessingProgress from "../ai/formula-generator/cloud-connector/ProcessingProgress";

const ReceiptUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleProcess = () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one document to process",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            toast({
              title: "Processing Complete",
              description: `Successfully processed ${files.length} document(s)`,
            });
            setFiles([]);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload receipts, invoices, or financial statements for AI processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isProcessing ? (
            <ProcessingProgress 
              isUploading={false} 
              uploadProgress={100}
              processingProgress={processingProgress} 
            />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/40">
                <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Drag files here or click to upload</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Supported formats: JPG, PNG, PDF
                </p>
                <Input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="max-w-xs"
                  onChange={handleFileChange}
                />
              </div>
              
              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files ({files.length})</Label>
                  <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div className="flex items-center">
                          <Receipt className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm font-medium truncate max-w-[200px]">
                            {file.name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-4 border-t">
          <Button variant="outline" disabled={isProcessing}>Clear All</Button>
          <Button onClick={handleProcess} disabled={files.length === 0 || isProcessing}>
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Process Documents
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Capture Options</CardTitle>
          <CardDescription>
            Additional ways to input documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg hover:bg-muted/20 transition-colors cursor-pointer">
            <div className="flex items-center mb-2">
              <Camera className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-medium">Camera Capture</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Use your device camera to capture receipts or invoices directly
            </p>
          </div>
          
          <div className="p-4 border rounded-lg hover:bg-muted/20 transition-colors cursor-pointer">
            <div className="flex items-center mb-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 text-[#2CA01C]" fill="none">
                <rect width="24" height="24" rx="4" fill="#2CA01C" />
                <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M14 9V13.5C14 14.3284 13.3284 15 12.5 15H11.5C10.6716 15 10 14.3284 10 13.5V12.5C10 11.6716 10.6716 11 11.5 11H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="17" cy="7" r="2" fill="white" />
              </svg>
              <h3 className="font-medium">Import from QuickBooks</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Process documents already stored in QuickBooks
            </p>
          </div>
          
          <div className="p-4 border rounded-lg hover:bg-muted/20 transition-colors cursor-pointer">
            <div className="flex items-center mb-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 text-[#13B5EA]" fill="none">
                <rect width="24" height="24" rx="4" fill="#13B5EA" />
                <path d="M7 9.5L10.5 14.5M10.5 9.5L7 14.5M13.5 9.5L17 14.5M17 9.5L13.5 14.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h3 className="font-medium">Import from Xero</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Process documents already stored in Xero
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptUploader;
