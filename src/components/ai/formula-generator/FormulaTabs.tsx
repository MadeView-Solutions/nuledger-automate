
import React from "react";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { Calculator, FileSpreadsheet, BarChart2, Lightbulb, FileCode, CloudUpload } from "lucide-react";
import FormulaTab from "./FormulaTab";
import PlaceholderTab from "./PlaceholderTab";
import ExcelAddinTab from "./ExcelAddinTab";
import CloudConnector from "./CloudConnector";
import { FormulaType, GeneratedFormula } from "./types";

interface FormulaTabsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  activeFormulaType: FormulaType;
  generatedFormula: GeneratedFormula | null;
  history: GeneratedFormula[];
  setGeneratedFormula: (formula: GeneratedFormula) => void;
  handleGenerateFormula: () => void;
  handleTabChange: (type: FormulaType) => void;
  copyFormulaToClipboard: () => void;
  formulaRef: React.RefObject<HTMLDivElement>;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isAddinInstalled: boolean;
  handleInstallAddin: () => void;
}

const FormulaTabs: React.FC<FormulaTabsProps> = ({
  prompt,
  setPrompt,
  isGenerating,
  activeFormulaType,
  generatedFormula,
  history,
  setGeneratedFormula,
  handleGenerateFormula,
  handleTabChange,
  copyFormulaToClipboard,
  formulaRef,
  handleKeyPress,
  isAddinInstalled,
  handleInstallAddin,
}) => {
  return (
    <Tabs defaultValue="formula" className="w-full">
      <TabsList className="grid grid-cols-6 mb-4">
        <TabsTrigger value="formula">
          <Calculator className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Formula</span>
        </TabsTrigger>
        <TabsTrigger value="cloud">
          <CloudUpload className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Cloud AI</span>
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

      <TabsContent value="cloud">
        <CloudConnector />
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
  );
};

export default FormulaTabs;
