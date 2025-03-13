
export const demoFormulas: Record<string, string> = {
  "Calculate monthly revenue growth": "=IFERROR((B2-B1)/B1, 0)",
  "Sum all expenses for Q1": "=SUM(B2:B4)",
  "Average profit margin for last 6 months": "=AVERAGE(D2:D7)",
  "Find transactions over $1000": '=FILTER(A2:C20, C2:C20>1000, "No results")',
  "Create a depreciation schedule for asset": "=SUM(PMT(rate/12, useful_life*12, -initial_cost))",
  "Calculate year-over-year growth percentage": "=(current_year_value-previous_year_value)/previous_year_value",
  "Show me cashflow projection for next quarter": "Complex formula - see explanation",
  "Find duplicate transactions": "=COUNTIFS(A:A,A1)>1",
  "Calculate gross margin for the last 6 months": "=SUM(B2:B7)/SUM(A2:A7)",
  "Find top 5 expenses and create a chart": '=SORT(A2:B20,2,-1)',
  "Fix errors in =SUM(A1:A10)/COUNT(B1:B10)": "=IFERROR(SUM(A1:A10)/COUNTA(B1:B10), 0)",
};

export const getFormulaExplanation = (formula: string): string => {
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
  } else if (formula.includes("SORT")) {
    return "sorts the data range by the specified column and creates a chart of the top results.";
  } else if (formula.includes("COUNTA")) {
    return "corrects the common error by using COUNTA instead of COUNT to handle non-numeric values.";
  } else {
    return "performs the calculation you requested based on your financial data.";
  }
};

export const suggestedPrompts = [
  "Calculate monthly revenue growth",
  "Sum all expenses for Q1",
  "Average profit margin for last 6 months",
  "Find transactions over $1000",
  "Calculate gross margin for the last 6 months",
  "Find top 5 expenses and create a chart",
  "Fix errors in =SUM(A1:A10)/COUNT(B1:B10)",
];
