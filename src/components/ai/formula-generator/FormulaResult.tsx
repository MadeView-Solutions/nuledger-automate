
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCopy, Download } from "lucide-react";
import { GeneratedFormula, FormulaType } from "./types";
import { exportFormulaToSpreadsheet } from "./formula-utils";

interface FormulaResultProps {
  generatedFormula: GeneratedFormula;
  activeFormulaType: FormulaType;
  handleTabChange: (type: FormulaType) => void;
  copyFormulaToClipboard: () => void;
  formulaRef: React.RefObject<HTMLDivElement>;
}

const FormulaResult: React.FC<FormulaResultProps> = ({
  generatedFormula,
  activeFormulaType,
  handleTabChange,
  copyFormulaToClipboard,
  formulaRef,
}) => {
  if (!generatedFormula) return null;

  const handleExportFormula = () => {
    exportFormulaToSpreadsheet(generatedFormula);
  };

  return (
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
        <div className="flex justify-end mt-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportFormula}
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
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
  );
};

export default FormulaResult;
