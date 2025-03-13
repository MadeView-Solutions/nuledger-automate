import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FileUp, Download, RefreshCw, Database, Lightbulb, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FileAnalysisResult } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import TechStackInfo from "./TechStackInfo";

const CloudConnector = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<FileAnalysisResult | null>(null);
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

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          handleProcessFile();
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleProcessFile = () => {
    setIsUploading(false);
    setIsProcessing(true);
    setProcessingProgress(0);
    
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          simulateAnalysisResult();
          return 100;
        }
        return prev + 5;
      });
    }, 400);
  };

  const simulateAnalysisResult = () => {
    setIsProcessing(false);
    
    const result: FileAnalysisResult = {
      id: Date.now().toString(),
      originalFileName: file?.name || "Unknown",
      errorCount: Math.floor(Math.random() * 5),
      optimizedFormulas: Math.floor(Math.random() * 10) + 3,
      insights: [
        "Found 3 circular references that could impact calculation accuracy",
        "Identified 2 complex VLOOKUP formulas that could be replaced with INDEX/MATCH for better performance",
        "Detected inconsistent date formats in columns C and D",
        "Cash flow projection formulas could be optimized for better forecasting accuracy"
      ],
      timestamp: new Date(),
    };
    
    setAnalysisResult(result);
    
    toast({
      title: "Analysis Complete",
      description: `Enhanced ${result.originalFileName} with ${result.optimizedFormulas} optimized formulas`,
    });
  };

  const handleDownloadEnhanced = () => {
    if (!analysisResult) return;
    
    toast({
      title: "Downloading Enhanced File",
      description: "Your AI-enhanced file is being downloaded",
    });
    
    setTimeout(() => {
      setFile(null);
      setAnalysisResult(null);
    }, 1500);
  };

  const renderUploadSection = () => (
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

  const renderProgressSection = () => (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">
        {isUploading ? "Uploading File" : "AI Processing"}
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{isUploading ? "Upload Progress" : "AI Analysis Progress"}</span>
          <span>{isUploading ? uploadProgress : processingProgress}%</span>
        </div>
        <Progress value={isUploading ? uploadProgress : processingProgress} />
      </div>
      <p className="text-sm text-muted-foreground">
        {isUploading 
          ? "Uploading your Excel file to the cloud..." 
          : "AI is analyzing formulas, finding errors, and generating insights..."}
      </p>
    </div>
  );

  const renderResultSection = () => (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Analysis Complete</h3>
              <p className="text-sm text-muted-foreground">
                {analysisResult?.originalFileName} has been enhanced
              </p>
            </div>
            <Button 
              variant="default" 
              onClick={handleDownloadEnhanced}
              className="ml-4"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Enhanced File
            </Button>
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
                <span className="font-medium">Errors Fixed</span>
              </div>
              <span className="text-lg font-bold">{analysisResult?.errorCount}</span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 text-blue-500 mr-2" />
                <span className="font-medium">Formulas Optimized</span>
              </div>
              <span className="text-lg font-bold">{analysisResult?.optimizedFormulas}</span>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
                <span className="font-medium">AI Insights</span>
              </div>
              <ul className="space-y-2 mt-2">
                {analysisResult?.insights.map((insight, index) => (
                  <li key={index} className="text-sm p-2 bg-muted rounded-md">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {!isUploading && !isProcessing && !analysisResult && renderUploadSection()}
      {(isUploading || isProcessing) && renderProgressSection()}
      {analysisResult && renderResultSection()}
      
      {!isUploading && !isProcessing && <TechStackInfo />}
    </div>
  );
};

export default CloudConnector;
