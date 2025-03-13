
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Check, AlertCircle, BarChart2, Calculator, Link } from "lucide-react";

interface ExcelAddinTabProps {
  isAddinInstalled: boolean;
  handleInstallAddin: () => void;
}

const ExcelAddinTab: React.FC<ExcelAddinTabProps> = ({ isAddinInstalled, handleInstallAddin }) => {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-5">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="w-12 h-12 md:w-14 md:h-14 text-blue-700 dark:text-blue-300" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-medium mb-2">NuLedger AI Excel Add-in</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Use AI-powered formula generation, error checking, and reporting directly inside Microsoft Excel.
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
                Excel 2019+
              </Badge>
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Office 365
              </Badge>
              <Badge variant="outline">Web Version</Badge>
            </div>
          </div>
          
          <div className="shrink-0">
            {isAddinInstalled ? (
              <Button variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800" disabled>
                <Check className="h-4 w-4 mr-2" />
                Installed
              </Button>
            ) : (
              <Button onClick={handleInstallAddin}>
                Install Add-in
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="border rounded-lg p-4">
          <div className="flex flex-col items-center text-center">
            <Calculator className="h-10 w-10 mb-2 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium mb-1">AI Formula Generation</h4>
            <p className="text-sm text-muted-foreground">
              Ask for formulas in plain English, and get Excel-ready formulas instantly.
            </p>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-10 w-10 mb-2 text-amber-600 dark:text-amber-400" />
            <h4 className="font-medium mb-1">Error Detection & Fixing</h4>
            <p className="text-sm text-muted-foreground">
              AI automatically detects and fixes errors in your formulas and data.
            </p>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex flex-col items-center text-center">
            <BarChart2 className="h-10 w-10 mb-2 text-purple-600 dark:text-purple-400" />
            <h4 className="font-medium mb-1">One-Click Reports</h4>
            <p className="text-sm text-muted-foreground">
              Generate professional financial reports with a single click.
            </p>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 mt-4">
        <h4 className="font-medium mb-2">Excel Add-in Demo</h4>
        <div className="bg-muted rounded-lg p-4 text-sm">
          <p className="font-semibold mb-2">In Excel, you would type:</p>
          <div className="bg-background border rounded p-2 mb-3">
            Calculate gross margin for Q2 and create a chart
          </div>
          
          <p className="font-semibold mb-2">And the add-in would generate:</p>
          <div className="bg-background border rounded p-2 font-mono mb-1 text-xs">
            =LET(revenue, SUM(B2:B4), costs, SUM(C2:C4), 
            margin, (revenue-costs)/revenue, 
            margin)
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            And automatically generate a chart visualization of the results
          </p>
          
          <Button size="sm" variant="outline" className="w-full sm:w-auto">
            <Link className="h-3 w-3 mr-1" />
            View Full Demo Video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExcelAddinTab;
