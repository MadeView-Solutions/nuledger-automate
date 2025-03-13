
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FormulaType, GeneratedFormula } from "../types";
import { demoFormulas, getFormulaExplanation } from "../formula-utils";

export function useFormulaGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFormulaType, setActiveFormulaType] = useState<FormulaType>("excel");
  const [generatedFormula, setGeneratedFormula] = useState<GeneratedFormula | null>(null);
  const [history, setHistory] = useState<GeneratedFormula[]>([]);
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

  return {
    prompt,
    setPrompt,
    isGenerating,
    activeFormulaType,
    generatedFormula,
    setGeneratedFormula,
    history,
    handleGenerateFormula,
    handleTabChange
  };
}
