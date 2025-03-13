
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

export interface ExportFormat {
  filename: string;
  extension: string;
}

export const exportFormats: Record<FormulaType, ExportFormat> = {
  excel: { filename: 'Excel_Formula', extension: 'xlsx' },
  sheets: { filename: 'Google_Sheets_Formula', extension: 'xlsx' },
  powerbi: { filename: 'PowerBI_Formula', extension: 'xlsx' },
  sql: { filename: 'SQL_Query', extension: 'xlsx' }
};

export interface FileAnalysisResult {
  id: string;
  originalFileName: string;
  errorCount: number;
  optimizedFormulas: number;
  insights: string[];
  timestamp: Date;
}
