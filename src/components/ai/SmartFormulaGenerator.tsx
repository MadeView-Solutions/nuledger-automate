
import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useFormulaGenerator } from "./formula-generator/hooks/useFormulaGenerator";
import FormulaGeneratorHeader from "./formula-generator/FormulaGeneratorHeader";
import FormulaGeneratorFooter from "./formula-generator/FormulaGeneratorFooter";
import FormulaTabs from "./formula-generator/FormulaTabs";

const SmartFormulaGenerator = () => {
  const [isAddinInstalled, setIsAddinInstalled] = useState(false);
  const formulaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const {
    prompt,
    setPrompt,
    isGenerating,
    activeFormulaType,
    generatedFormula,
    setGeneratedFormula,
    history,
    handleGenerateFormula,
    handleTabChange
  } = useFormulaGenerator();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerateFormula();
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

  const handleInstallAddin = () => {
    setIsAddinInstalled(true);
    toast({
      title: "Excel Add-in Installed",
      description: "NuLedger AI Excel Add-in has been successfully installed. You can now use it directly in Excel.",
    });
  };

  return (
    <Card className="border shadow-sm">
      <FormulaGeneratorHeader />
      <CardContent className="space-y-4">
        <FormulaTabs
          prompt={prompt}
          setPrompt={setPrompt}
          isGenerating={isGenerating}
          activeFormulaType={activeFormulaType}
          generatedFormula={generatedFormula}
          history={history}
          setGeneratedFormula={setGeneratedFormula}
          handleGenerateFormula={handleGenerateFormula}
          handleTabChange={handleTabChange}
          copyFormulaToClipboard={copyFormulaToClipboard}
          formulaRef={formulaRef}
          handleKeyPress={handleKeyPress}
          isAddinInstalled={isAddinInstalled}
          handleInstallAddin={handleInstallAddin}
        />
      </CardContent>
      <FormulaGeneratorFooter />
    </Card>
  );
};

export default SmartFormulaGenerator;
