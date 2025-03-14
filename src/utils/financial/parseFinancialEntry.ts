
import { FinancialEntry } from "./financialTypes";

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

/**
 * Extracts a meaningful entity name from text
 */
function extractEntity(text: string): string | undefined {
  if (!text) return undefined;
  
  // Remove filler words and clean up the text
  const fillerWords = ["the", "a", "an", "my", "our", "their", "for", "to", "from"];
  let cleaned = text;
  
  fillerWords.forEach(word => {
    // Replace word at the beginning of the string with empty string
    const regex = new RegExp(`^${word} `, 'i');
    cleaned = cleaned.replace(regex, '');
  });
  
  // Get the first few words (likely the entity name)
  const words = cleaned.split(/\s+/);
  if (words.length === 0) return undefined;
  
  // Take up to 3 words for the entity name
  return words.slice(0, Math.min(3, words.length)).join(" ");
}

/**
 * Extracts expense categories from transcript with expanded categories
 */
function extractExpenseCategory(transcript: string): string | undefined {
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
function extractIncomeCategory(transcript: string): string | undefined {
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

/**
 * Improved date extraction from transcript
 */
function extractDate(transcript: string): Date | undefined {
  const months = [
    "january", "february", "march", "april", "may", "june", 
    "july", "august", "september", "october", "november", "december",
    "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec"
  ];
  
  const fullMonthMap: Record<string, number> = {
    "january": 0, "february": 1, "march": 2, "april": 3, "may": 4, "june": 5, 
    "july": 6, "august": 7, "september": 8, "october": 9, "november": 10, "december": 11,
    "jan": 0, "feb": 1, "mar": 2, "apr": 3, "jun": 5, "jul": 6, 
    "aug": 7, "sep": 8, "sept": 8, "oct": 9, "nov": 10, "dec": 11
  };
  
  // Extract date patterns like "January 15" or "Jan 15, 2023"
  for (const month of months) {
    if (transcript.toLowerCase().includes(month)) {
      const monthIndex = fullMonthMap[month];
      
      // Look for year pattern after month (e.g., "2023" or "'23")
      let year = new Date().getFullYear();
      const yearPattern = new RegExp(`${month}\\s+\\d+(?:\\s*,\\s*(\\d{4}|'\\d{2}))?`, 'i');
      const yearMatch = transcript.toLowerCase().match(yearPattern);
      
      if (yearMatch && yearMatch[1]) {
        // Extract year
        if (yearMatch[1].startsWith("'")) {
          // Handle abbreviated year like '23
          const yearNum = parseInt(yearMatch[1].substring(1));
          year = 2000 + yearNum; // Assume 21st century
        } else {
          year = parseInt(yearMatch[1]);
        }
      }
      
      // Extract day number after month
      const dayPattern = new RegExp(`${month}\\s+(\\d+)`, 'i');
      const dayMatch = transcript.toLowerCase().match(dayPattern);
      
      if (dayMatch && dayMatch[1]) {
        const day = parseInt(dayMatch[1]);
        const date = new Date(year, monthIndex, day);
        return date;
      } else {
        // If no specific day was mentioned, default to the 1st
        const date = new Date(year, monthIndex, 1);
        return date;
      }
    }
  }
  
  // Handle relative dates
  const lowerTranscript = transcript.toLowerCase();
  
  // Today
  if (lowerTranscript.includes("today")) {
    return new Date();
  } 
  // Yesterday
  else if (lowerTranscript.includes("yesterday")) {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }
  // Tomorrow
  else if (lowerTranscript.includes("tomorrow")) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  }
  // Last week
  else if (lowerTranscript.includes("last week")) {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }
  // Next week
  else if (lowerTranscript.includes("next week")) {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  }
  // This month
  else if (lowerTranscript.includes("this month")) {
    const date = new Date();
    date.setDate(1); // First day of current month
    return date;
  }
  // Last month
  else if (lowerTranscript.includes("last month")) {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    date.setDate(1); // First day of previous month
    return date;
  }
  // Day of week (e.g., "on Monday")
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  for (let i = 0; i < daysOfWeek.length; i++) {
    if (lowerTranscript.includes(daysOfWeek[i])) {
      const today = new Date();
      const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
      const targetDay = i;
      
      // Calculate days to add
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0) {
        daysToAdd += 7; // Move to next week if the day has already passed this week
      }
      
      // If "last" is mentioned before the day, go to previous week
      if (lowerTranscript.includes(`last ${daysOfWeek[i]}`)) {
        daysToAdd -= 7;
      }
      
      const date = new Date();
      date.setDate(today.getDate() + daysToAdd);
      return date;
    }
  }
  
  return undefined;
}

/**
 * Generate a more detailed description based on available information
 */
function generateDescription(
  type: "expense" | "income" | "transfer", 
  amount: number,
  category?: string, 
  source?: string, 
  destination?: string,
  date?: Date
): string {
  const parts: string[] = [];
  
  // Start with the transaction type
  if (type === "expense") {
    parts.push(`Expense of $${amount}`);
  } else if (type === "income") {
    parts.push(`Income of $${amount}`);
  } else {
    parts.push(`Transfer of $${amount}`);
  }
  
  // Add category if available
  if (category) {
    parts.push(`for ${category}`);
  }
  
  // Add source/destination details
  if (type === "expense" && source) {
    parts.push(`at ${source}`);
  } else if (type === "income" && source) {
    parts.push(`from ${source}`);
  } else if (type === "transfer") {
    if (source && destination) {
      parts.push(`from ${source} to ${destination}`);
    } else if (source) {
      parts.push(`from ${source}`);
    } else if (destination) {
      parts.push(`to ${destination}`);
    }
  }
  
  // Add date information if available
  if (date) {
    parts.push(`on ${date.toLocaleDateString()}`);
  }
  
  return parts.join(" ");
}
