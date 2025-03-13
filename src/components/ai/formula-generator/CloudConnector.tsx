
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FileAnalysisResult } from "./types";
import TechStackInfo from "./TechStackInfo";
import FileUploader from "./cloud-connector/FileUploader";
import ProcessingProgress from "./cloud-connector/ProcessingProgress";
import AnalysisResult from "./cloud-connector/AnalysisResult";

const CloudConnector = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<FileAnalysisResult | null>(null);
  const { toast } = useToast();

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

  return (
    <div className="space-y-6">
      {!isUploading && !isProcessing && !analysisResult && (
        <FileUploader
          file={file}
          setFile={setFile}
          handleUpload={handleUpload}
          isUploading={isUploading}
        />
      )}
      
      {(isUploading || isProcessing) && (
        <ProcessingProgress
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          processingProgress={processingProgress}
        />
      )}
      
      {analysisResult && (
        <AnalysisResult
          analysisResult={analysisResult}
          handleDownloadEnhanced={handleDownloadEnhanced}
        />
      )}
      
      {!isUploading && !isProcessing && <TechStackInfo />}
    </div>
  );
};

export default CloudConnector;
