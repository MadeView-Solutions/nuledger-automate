
import React from "react";
import FormulaInput from "./FormulaInput";
import FormulaResult from "./FormulaResult";
import HistoryList from "./HistoryList";
import { GeneratedFormula, FormulaType } from "./types";

interface FormulaTabProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  handleGenerateFormula: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  generatedFormula: GeneratedFormula | null;
  activeFormulaType: FormulaType;
  handleTabChange: (type: FormulaType) => void;
  copyFormulaToClipboard: () => void;
  formulaRef: React.RefObject<HTMLDivElement>;
  history: GeneratedFormula[];
  setGeneratedFormula: (formula: GeneratedFormula) => void;
}

const FormulaTab: React.FC<FormulaTabProps> = ({
  prompt,
  setPrompt,
  isGenerating,
  handleGenerateFormula,
  handleKeyPress,
  generatedFormula,
  activeFormulaType,
  handleTabChange,
  copyFormulaToClipboard,
  formulaRef,
  history,
  setGeneratedFormula,
}) => {
  return (
    <div className="space-y-4">
      <FormulaInput
        prompt={prompt}
        setPrompt={setPrompt}
        isGenerating={isGenerating}
        handleGenerateFormula={handleGenerateFormula}
        handleKeyPress={handleKeyPress}
      />

      {generatedFormula && (
        <FormulaResult
          generatedFormula={generatedFormula}
          activeFormulaType={activeFormulaType}
          handleTabChange={handleTabChange}
          copyFormulaToClipboard={copyFormulaToClipboard}
          formulaRef={formulaRef}
        />
      )}

      {history.length > 0 && !generatedFormula && (
        <HistoryList 
          history={history} 
          setGeneratedFormula={setGeneratedFormula} 
        />
      )}
    </div>
  );
};

export default FormulaTab;
