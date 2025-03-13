
export type FormulaType = "excel" | "sheets" | "powerbi" | "sql";
export type AnalysisType = "report" | "insights" | "errors" | "optimization";

export interface GeneratedFormula {
  id: string;
  prompt: string;
  formula: string;
  type: FormulaType;
  explanation: string;
  timestamp: Date;
}
