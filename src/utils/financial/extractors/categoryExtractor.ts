
/**
 * Utility for extracting categories from financial voice commands
 */

/**
 * Extracts expense categories from transcript with expanded categories
 */
export function extractExpenseCategory(transcript: string): string | undefined {
  const expenseCategories = [
    "office supplies", "office", "supplies", "travel", "meals", "food", "dining", 
    "rent", "utilities", "software", "hardware", "marketing", "advertising", 
    "salary", "payroll", "transportation", "insurance", "medical", "healthcare",
    "entertainment", "subscription", "education", "training", "tax", "fees",
    "maintenance", "repair", "equipment", "furniture", "clothing", "electronics",
    "groceries", "household", "childcare", "gas", "fuel", "automotive", "legal",
    "shipping", "postage", "charitable", "donation", "misc", "miscellaneous"
  ];
  
  // Sort categories by length (descending) so that multi-word categories are checked first
  const sortedCategories = [...expenseCategories].sort((a, b) => b.length - a.length);
  
  for (const cat of sortedCategories) {
    if (transcript.includes(cat)) {
      return cat;
    }
  }
  
  return undefined;
}

/**
 * Extracts income categories from transcript with expanded categories
 */
export function extractIncomeCategory(transcript: string): string | undefined {
  const incomeCategories = [
    "salary", "wage", "commission", "bonus", "sales", "consulting", "freelance",
    "service", "revenue", "interest", "dividend", "rental", "investment", "refund",
    "royalty", "gift", "grant", "reimbursement", "cashback", "profit", "side hustle",
    "pension", "retirement", "social security", "unemployment", "tax return"
  ];
  
  // Sort categories by length (descending) so that multi-word categories are checked first
  const sortedCategories = [...incomeCategories].sort((a, b) => b.length - a.length);
  
  for (const cat of sortedCategories) {
    if (transcript.includes(cat)) {
      return cat;
    }
  }
  
  return undefined;
}
