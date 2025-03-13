
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Edit, Download, FileDown, RefreshCw } from "lucide-react";

// Mock data for extracted data
const extractedDocuments = [
  {
    id: "doc-1",
    filename: "invoice-acme-corp.pdf",
    vendor: "ACME Corporation",
    date: "2023-06-15",
    amount: 1250.75,
    taxAmount: 187.61,
    category: "Office Supplies",
    confidence: 0.94,
  },
  {
    id: "doc-2",
    filename: "receipt-office-supplies.jpg",
    vendor: "Office Depot",
    date: "2023-06-20",
    amount: 89.99,
    taxAmount: 7.2,
    category: "Office Supplies",
    confidence: 0.87,
  },
  {
    id: "doc-3",
    filename: "statement-q2-2023.pdf",
    vendor: "Cloudstor Services",
    date: "2023-06-30",
    amount: 399.00,
    taxAmount: 31.92,
    category: "Software & IT",
    confidence: 0.92,
  }
];

const ExtractedDataReview = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = (format: string) => {
    setIsExporting(true);
    
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export Complete",
        description: `Data successfully exported in ${format} format`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Extracted Financial Data</CardTitle>
          <CardDescription>
            Review and correct AI-extracted data before exporting to accounting systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extractedDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.vendor}</TableCell>
                    <TableCell>{doc.date}</TableCell>
                    <TableCell>${doc.amount.toFixed(2)}</TableCell>
                    <TableCell>${doc.taxAmount.toFixed(2)}</TableCell>
                    <TableCell>{doc.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-2 w-16 bg-muted rounded-full overflow-hidden mr-2">
                          <div 
                            className={`h-full ${
                              doc.confidence > 0.9 
                                ? "bg-green-500" 
                                : doc.confidence > 0.8 
                                ? "bg-amber-500" 
                                : "bg-red-500"
                            } transition-all duration-300`} 
                            style={{ width: `${doc.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{Math.round(doc.confidence * 100)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">
            {extractedDocuments.length} documents processed with AI
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleExport("CSV")}>
              <FileDown className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("XLSX")}>
              <FileDown className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button onClick={() => handleExport("QB")} disabled={isExporting}>
              {isExporting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export to QuickBooks
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <TechStackCard />
    </div>
  );
};

const TechStackCard = () => {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-base">Tech Stack</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">OCR & Document Processing</h3>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
              <span>Azure Form Recognizer</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
              <span>Tesseract OCR</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">AI & ML Processing</h3>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <span>GPT-4 Natural Language Processing</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
              <span>Custom Financial ML Models</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Integration</h3>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-teal-500 mr-2" />
              <span>QuickBooks & Xero APIs</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
              <span>UiPath RPA</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtractedDataReview;
