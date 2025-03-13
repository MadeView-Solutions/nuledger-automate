
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { Calculator, AlertCircle, Code2, FileSpreadsheet, BarChart2, Lightbulb, FileCode } from "lucide-react";
import { FormulaType, GeneratedFormula } from "./formula-generator/types";
import { demoFormulas, getFormulaExplanation } from "./formula-generator/formula-utils";
import FormulaTab from "./formula-generator/FormulaTab";
import PlaceholderTab from "./formula-generator/PlaceholderTab";
import ExcelAddinTab from "./formula-generator/ExcelAddinTab";

const SmartFormulaGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFormulaType, setActiveFormulaType] = useState<FormulaType>("excel");
  const [generatedFormula, setGeneratedFormula] = useState<GeneratedFormula | null>(null);
  const [history, setHistory] = useState<GeneratedFormula[]>([]);
  const [isAddinInstalled, setIsAddinInstalled] = useState(false);
  const formulaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleGenerateFormula = () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a description of the formula you need.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      let matchedFormula = "";
      let explanation = "";
      
      const promptLower = prompt.toLowerCase();
      const demoKeys = Object.keys(demoFormulas);
      
      const matchedKey = demoKeys.find(key => 
        promptLower.includes(key.toLowerCase()) || 
        key.toLowerCase().includes(promptLower)
      );
      
      if (matchedKey) {
        matchedFormula = demoFormulas[matchedKey];
        
        if (matchedFormula === "Complex formula - see explanation") {
          matchedFormula = "=FORECAST.ETS(A30, A1:A29, B1:B29)";
          explanation = "This formula uses Excel's FORECAST.ETS function which applies exponential triple smoothing algorithm to predict future values based on historical data.";
        } else {
          explanation = `This ${activeFormulaType.toUpperCase()} formula ${getFormulaExplanation(matchedFormula)}`;
        }
      } else {
        matchedFormula = activeFormulaType === "sql" 
          ? "SELECT SUM(amount) FROM transactions WHERE date BETWEEN '2023-01-01' AND '2023-03-31'" 
          : "=SUMIFS(amount_column, date_column, \">=\"&DATE(2023,1,1), date_column, \"<=\"&DATE(2023,3,31))";
          
        explanation = "This formula calculates the sum of values that meet specific date criteria in your financial data.";
      }

      const newFormula: GeneratedFormula = {
        id: Date.now().toString(),
        prompt,
        formula: matchedFormula,
        type: activeFormulaType,
        explanation,
        timestamp: new Date(),
      };

      setGeneratedFormula(newFormula);
      setHistory(prev => [newFormula, ...prev.slice(0, 4)]);
      setIsGenerating(false);

      toast({
        title: "Formula Generated",
        description: "Your formula is ready to use.",
      });
    }, 1500);
  };

  const copyFormulaToClipboard = () => {
    if (generatedFormula) {
      navigator.clipboard.writeText(generatedFormula.formula);
      toast({
        title: "Copied to Clipboard",
        description: "Formula has been copied to clipboard.",
      });
    }
  };

  const handleTabChange = (type: FormulaType) => {
    setActiveFormulaType(type);
    if (generatedFormula) {
      let convertedFormula = generatedFormula.formula;
      
      if (type === "sql" && generatedFormula.type !== "sql") {
        convertedFormula = "SELECT SUM(amount) FROM transactions WHERE category = 'expense'";
      } else if (type !== "sql" && generatedFormula.type === "sql") {
        convertedFormula = "=SUMIF(category_column, \"expense\", amount_column)";
      }
      
      setGeneratedFormula({
        ...generatedFormula,
        formula: convertedFormula,
        type,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerateFormula();
    }
  };

  const handleInstallAddin = () => {
    setIsAddinInstalled(true);
    toast({
      title: "Excel Add-in Installed",
      description: "NuLedger AI Excel Add-in has been successfully installed. You can now use it directly in Excel.",
    });
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          AI Formula Generator & Excel Integration
          <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-950">
            <Code2 className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          Generate formulas, reports, and financial insights using natural language - now with Excel integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="formula" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="formula">
              <Calculator className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Formula</span>
            </TabsTrigger>
            <TabsTrigger value="report">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="analysis">
              <BarChart2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Lightbulb className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="excel-addin">
              <FileCode className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Excel Add-in</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formula">
            <FormulaTab
              prompt={prompt}
              setPrompt={setPrompt}
              isGenerating={isGenerating}
              handleGenerateFormula={handleGenerateFormula}
              handleKeyPress={handleKeyPress}
              generatedFormula={generatedFormula}
              activeFormulaType={activeFormulaType}
              handleTabChange={handleTabChange}
              copyFormulaToClipboard={copyFormulaToClipboard}
              formulaRef={formulaRef}
              history={history}
              setGeneratedFormula={setGeneratedFormula}
            />
          </TabsContent>

          <TabsContent value="report">
            <PlaceholderTab 
              icon="report"
              title="Automated Report Generation"
              description="Upload financial data to automatically generate P&L statements, balance sheets, and cash flow forecasts."
              buttonText="Upload Financial Data"
            />
          </TabsContent>

          <TabsContent value="analysis">
            <PlaceholderTab
              icon="analysis"
              title="Data Analysis & Error Detection"
              description="AI will analyze your spreadsheets to find errors and optimizations in your formulas."
              buttonText="Start Analysis"
            />
          </TabsContent>
          
          <TabsContent value="insights">
            <PlaceholderTab
              icon="insights"
              title="Smart Financial Insights"
              description="Get AI-powered insights and recommendations based on your financial data."
              buttonText="Generate Insights"
            />
          </TabsContent>

          <TabsContent value="excel-addin">
            <ExcelAddinTab 
              isAddinInstalled={isAddinInstalled}
              handleInstallAddin={handleInstallAddin}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
        <div className="flex items-center text-xs text-muted-foreground">
          <AlertCircle className="h-3 w-3 mr-1" />
          Formulas are optimized based on common accounting standards
        </div>
        <Button variant="outline" size="sm">
          View Documentation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SmartFormulaGenerator;
