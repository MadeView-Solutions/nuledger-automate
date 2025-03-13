
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceiptUploader from "./ReceiptUploader";
import ProcessingQueue from "./ProcessingQueue";
import ExtractedDataReview from "./ExtractedDataReview";

const ReceiptProcessorTabs = () => {
  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="upload">Upload & Process</TabsTrigger>
        <TabsTrigger value="queue">Processing Queue</TabsTrigger>
        <TabsTrigger value="review">Review & Export</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload">
        <ReceiptUploader />
      </TabsContent>
      
      <TabsContent value="queue">
        <ProcessingQueue />
      </TabsContent>
      
      <TabsContent value="review">
        <ExtractedDataReview />
      </TabsContent>
    </Tabs>
  );
};

export default ReceiptProcessorTabs;
