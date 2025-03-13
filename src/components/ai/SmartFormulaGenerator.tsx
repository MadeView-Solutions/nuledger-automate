
import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { Loader2, Calculator, Check, ClipboardCopy, AlertCircle, ArrowRight, FileSpreadsheet, BarChart2, Code2, Lightbulb } from "lucide-react";

type FormulaType = "excel" | "sheets" | "powerbi" | "sql";
type AnalysisType = "report" | "insights" | "errors" | "optimization";

interface GeneratedFormula {
  id: string;
  prompt: string;
  formula: string;
  type: FormulaType;
  explanation: string;
  timestamp: Date;
}

// Mock formulas for demo purposes
const demoFormulas: Record<string, string> = {
  "Calculate monthly revenue growth": "=IFERROR((B2-B1)/B1, 0)",
  "Sum all expenses for Q1": "=SUM(B2:B4)",
  "Average profit margin for last 6 months": "=AVERAGE(D2:D7)",
  "Find transactions over $1000": '=FILTER(A2:C20, C2:C20>1000, "No results")',
  "Create a depreciation schedule for asset": "=SUM(PMT(rate/12, useful_life*12, -initial_cost))",
  "Calculate year-over-year growth percentage": "=(current_year_value-previous_year_value)/previous_year_value",
  "Show me cashflow projection for next quarter": "Complex formula - see explanation",
  "Find duplicate transactions": "=COUNTIFS(A:A,A1)>1",
};

const SmartFormulaGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFormulaType, setActiveFormulaType] = useState<FormulaType>("excel");
  const [activeAnalysisType, setActiveAnalysisType] = useState<AnalysisType>("report");
  const [generatedFormula, setGeneratedFormula] = useState<GeneratedFormula | null>(null);
  const [history, setHistory] = useState<GeneratedFormula[]>([]);
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

    // Simulate AI processing delay
    setTimeout(() => {
      // For demo purposes, check if the prompt contains any of our demo formula keys
      let matchedFormula = "";
      let explanation = "";
      
      // Find closest match in our demo formulas
      const promptLower = prompt.toLowerCase();
      const demoKeys = Object.keys(demoFormulas);
      
      const matchedKey = demoKeys.find(key => 
        promptLower.includes(key.toLowerCase()) || 
        key.toLowerCase().includes(promptLower)
      );
      
      if (matchedKey) {
        matchedFormula = demoFormulas[matchedKey];
        
        // Generate an explanation
        if (matchedFormula === "Complex formula - see explanation") {
          matchedFormula = "=FORECAST.ETS(A30, A1:A29, B1:B29)";
          explanation = "This formula uses Excel's FORECAST.ETS function which applies exponential triple smoothing algorithm to predict future values based on historical data.";
        } else {
          explanation = `This ${activeFormulaType.toUpperCase()} formula ${getFormulaExplanation(matchedFormula)}`;
        }
      } else {
        // Generate a generic formula if no match is found
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

  const getFormulaExplanation = (formula: string): string => {
    if (formula.includes("SUM")) {
      return "calculates the total sum of the specified range.";
    } else if (formula.includes("AVERAGE")) {
      return "computes the average value across the specified range.";
    } else if (formula.includes("IFERROR")) {
      return "calculates the growth rate while handling potential division by zero errors.";
    } else if (formula.includes("FILTER")) {
      return "filters data based on the specified condition.";
    } else if (formula.includes("PMT")) {
      return "calculates the payment for a loan or depreciation of an asset over time.";
    } else if (formula.includes("COUNTIFS")) {
      return "counts items that meet multiple criteria, useful for finding duplicates.";
    } else {
      return "performs the calculation you requested based on your financial data.";
    }
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
      // Convert formula to the selected format
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

  const suggestedPrompts = [
    "Calculate monthly revenue growth",
    "Sum all expenses for Q1",
    "Average profit margin for last 6 months",
    "Find transactions over $1000",
  ];

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          AI Formula Generator & Analyzer
          <Badge variant="outline" className="ml-2 bg-blue-50 dark:bg-blue-950">
            <Code2 className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          Generate formulas, reports, and financial insights using natural language
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="formula" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
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
          </TabsList>

          <TabsContent value="formula" className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Textarea
                  placeholder="Describe the formula you need in plain English (e.g., 'Calculate monthly revenue growth')"
                  className="min-h-[80px] resize-none pr-12"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button
                  size="sm"
                  className="absolute right-2 bottom-2"
                  onClick={handleGenerateFormula}
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {suggestedPrompts.map((suggestedPrompt) => (
                  <Button
                    key={suggestedPrompt}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(suggestedPrompt)}
                    className="text-xs"
                  >
                    {suggestedPrompt}
                  </Button>
                ))}
              </div>
            </div>

            {generatedFormula && (
              <div className="space-y-4 mt-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">Generated Formula</h4>
                    <div className="flex gap-2">
                      <Tabs value={activeFormulaType} className="w-full">
                        <TabsList className="h-8">
                          <TabsTrigger value="excel" onClick={() => handleTabChange("excel")} className="text-xs h-7 px-2">
                            Excel
                          </TabsTrigger>
                          <TabsTrigger value="sheets" onClick={() => handleTabChange("sheets")} className="text-xs h-7 px-2">
                            Sheets
                          </TabsTrigger>
                          <TabsTrigger value="powerbi" onClick={() => handleTabChange("powerbi")} className="text-xs h-7 px-2">
                            Power BI
                          </TabsTrigger>
                          <TabsTrigger value="sql" onClick={() => handleTabChange("sql")} className="text-xs h-7 px-2">
                            SQL
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                  <div 
                    ref={formulaRef} 
                    className="bg-muted p-3 rounded-md font-mono text-sm whitespace-pre-wrap break-all overflow-x-auto"
                  >
                    {generatedFormula.formula}
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyFormulaToClipboard}
                      className="text-xs"
                    >
                      <ClipboardCopy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h4 className="font-medium text-sm mb-2">Explanation</h4>
                  <p className="text-sm text-muted-foreground">
                    {generatedFormula.explanation}
                  </p>
                </div>
              </div>
            )}

            {history.length > 0 && !generatedFormula && (
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Recent Formulas</h4>
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 cursor-pointer"
                      onClick={() => setGeneratedFormula(item)}
                    >
                      <div>
                        <p className="text-sm font-medium">{item.prompt}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {item.formula}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.type.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="report" className="space-y-4">
            <div className="text-center py-6">
              <FileSpreadsheet className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Automated Report Generation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload financial data to automatically generate P&L statements, balance sheets, and cash flow forecasts.
              </p>
              <Button className="mx-auto">
                Upload Financial Data
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="text-center py-6">
              <BarChart2 className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Data Analysis & Error Detection</h3>
              <p className="text-sm text-muted-foreground mb-4">
                AI will analyze your spreadsheets to find errors and optimizations in your formulas.
              </p>
              <Button className="mx-auto">
                Start Analysis
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <div className="text-center py-6">
              <Lightbulb className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Smart Financial Insights</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get AI-powered insights and recommendations based on your financial data.
              </p>
              <Button className="mx-auto">
                Generate Insights
              </Button>
            </div>
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
