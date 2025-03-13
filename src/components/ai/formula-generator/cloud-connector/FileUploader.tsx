
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, Database, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  handleUpload: () => void;
  isUploading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  file, 
  setFile, 
  handleUpload, 
  isUploading 
}) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        toast({
          title: "Invalid File Format",
          description: "Please upload an Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/40">
        <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Upload Excel File</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          AI will scan your spreadsheet, fix formula errors, and suggest optimizations
        </p>
        <Input
          type="file"
          onChange={handleFileChange}
          className="max-w-xs"
          accept=".xlsx,.xls"
        />
      </div>
      
      {file && (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <div className="flex items-center">
              <Database className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium truncate max-w-[200px]">
                {file.name}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Analyze with AI"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
