
import { FinancialEntry } from "./financialTypes";
import { extractEntity } from "./extractors/entityExtractor";
import { extractExpenseCategory, extractIncomeCategory } from "./extractors/categoryExtractor";
import { extractDate } from "./extractors/dateExtractor";
import { generateDescription } from "./formatters/descriptionFormatter";

/**
 * Parses a spoken financial entry into a structured object
 */
export const parseFinancialEntry = async (transcript: string): Promise<FinancialEntry> => {
  // For demo purposes, we're implementing an improved rule-based parser
  // In a real implementation, this would use OpenAI's API or another NLP service
  
  const lowerTranscript = transcript.toLowerCase().trim();
  
  // Initialize with defaults
  let type: "expense" | "income" | "transfer" = "expense"; // Default to expense
  let amount = 0;
  let source: string | undefined = undefined;
  let destination: string | undefined = undefined;
  let date: Date | undefined = undefined;
  let category: string | undefined = undefined;
  let description = "";
  
  // Extract amount - improved regex to handle currency formats like $1,234.56
  const amountMatch = lowerTranscript.match(/\$?(\d+(?:,\d+)*(?:\.\d+)?)/);
  if (amountMatch) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }
  
  // Determine type of transaction with more accurate keywords
  if (
    lowerTranscript.includes("transfer") || 
    lowerTranscript.includes("move") ||
    lowerTranscript.includes("send") ||
    (lowerTranscript.includes("from") && lowerTranscript.includes("to"))
  ) {
    type = "transfer";
    
    // Improved extraction of source and destination for transfers
    if (lowerTranscript.includes("from") && lowerTranscript.includes("to")) {
      const fromIndex = lowerTranscript.indexOf("from");
      const toIndex = lowerTranscript.indexOf("to");
      
      if (fromIndex < toIndex) {
        // Extract text between "from" and "to"
        source = extractEntity(lowerTranscript.substring(fromIndex + 4, toIndex).trim());
        
        // Extract text after "to"
        const afterTo = lowerTranscript.substring(toIndex + 2).trim();
        destination = extractEntity(afterTo);
      } else {
        // Handle "to X from Y" format
        destination = extractEntity(lowerTranscript.substring(toIndex + 2, fromIndex).trim());
        const afterFrom = lowerTranscript.substring(fromIndex + 4).trim();
        source = extractEntity(afterFrom);
      }
    }
  } else if (
    lowerTranscript.includes("expense") || 
    lowerTranscript.includes("spent") || 
    lowerTranscript.includes("paid") ||
    lowerTranscript.includes("buy") ||
    lowerTranscript.includes("bought") ||
    lowerTranscript.includes("purchase") ||
    lowerTranscript.includes("payment") ||
    lowerTranscript.includes("cost")
  ) {
    type = "expense";
    
    // Improved extraction of vendor/source for expenses
    const sourcePrepositions = ["from", "at", "to", "for"];
    for (const prep of sourcePrepositions) {
      if (lowerTranscript.includes(` ${prep} `)) {
        const parts = lowerTranscript.split(` ${prep} `);
        if (parts.length > 1) {
          source = extractEntity(parts[1]);
          break;
        }
      }
    }
    
    // Extract category for expenses with more categories
    category = extractExpenseCategory(lowerTranscript);
  } else if (
    lowerTranscript.includes("income") || 
    lowerTranscript.includes("earned") ||
    lowerTranscript.includes("received") ||
    lowerTranscript.includes("got paid") ||
    lowerTranscript.includes("salary") ||
    lowerTranscript.includes("revenue") ||
    lowerTranscript.includes("deposit")
  ) {
    type = "income";
    
    // Improved extraction of source for income
    if (lowerTranscript.includes("from")) {
      const parts = lowerTranscript.split("from");
      if (parts.length > 1) {
        source = extractEntity(parts[1].trim());
      }
    }
    
    // Extract category for income with more categories
    category = extractIncomeCategory(lowerTranscript);
  }
  
  // Improved date extraction logic
  date = extractDate(lowerTranscript);
  
  // Generate a better description
  description = generateDescription(type, amount, category, source, destination, date);
  
  // Simulate a small delay to mimic API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    type,
    amount,
    source,
    destination,
    date,
    category,
    description
  };
};
