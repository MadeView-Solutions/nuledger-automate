
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IntegrationCard from "./IntegrationCard";
import OpenAILogo from "./logos/OpenAILogo";
import AWSTextractLogo from "./logos/AWSTextractLogo";
import GoogleVisionLogo from "./logos/GoogleVisionLogo";

const AIProcessing = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI & OCR Processing Integrations</CardTitle>
          <CardDescription>
            Leverage artificial intelligence and optical character recognition for automated document processing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <IntegrationCard
              title="OpenAI"
              description="Utilize AI for intelligent data analysis, categorization, and insights generation."
              icon={<OpenAILogo />}
              status="connected"
              lastSync="2023-07-19T09:45:00Z"
            />
            
            <IntegrationCard
              title="AWS Textract"
              description="Extract text, data, and insights from documents with AWS Textract OCR technology."
              icon={<AWSTextractLogo />}
              status="available"
            />
            
            <IntegrationCard
              title="Google Vision AI"
              description="Process images and documents with Google's machine learning and OCR capabilities."
              icon={<GoogleVisionLogo />}
              status="available"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIProcessing;
