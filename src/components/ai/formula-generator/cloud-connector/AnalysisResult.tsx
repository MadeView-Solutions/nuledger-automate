
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, XCircle, RefreshCw, Lightbulb } from "lucide-react";
import { FileAnalysisResult } from "../types";

interface AnalysisResultProps {
  analysisResult: FileAnalysisResult;
  handleDownloadEnhanced: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({
  analysisResult,
  handleDownloadEnhanced
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Analysis Complete</h3>
              <p className="text-sm text-muted-foreground">
                {analysisResult.originalFileName} has been enhanced
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
              <span className="text-lg font-bold">{analysisResult.errorCount}</span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 text-blue-500 mr-2" />
                <span className="font-medium">Formulas Optimized</span>
              </div>
              <span className="text-lg font-bold">{analysisResult.optimizedFormulas}</span>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
                <span className="font-medium">AI Insights</span>
              </div>
              <ul className="space-y-2 mt-2">
                {analysisResult.insights.map((insight, index) => (
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
};

export default AnalysisResult;
