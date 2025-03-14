// Define types for the financial entries
export interface FinancialEntry {
  type: "expense" | "income" | "transfer";
  amount: number;
  source?: string;
  destination?: string;
  date?: Date;
  category?: string;
  description: string;
}

// Define interface for SpeechRecognition API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex?: number;
  error?: any;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal?: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Mock implementation of what would normally be an API call to OpenAI or similar
export const parseFinancialEntry = async (transcript: string): Promise<FinancialEntry> => {
  // For demo purposes, we're implementing a simple rule-based parser
  // In a real implementation, this would use OpenAI's API or another NLP service
  
  const lowerTranscript = transcript.toLowerCase();
  let type: "expense" | "income" | "transfer";
  let amount = 0;
  let source = undefined;
  let destination = undefined;
  let date = undefined;
  let category = undefined;
  
  // Extract amount (looking for patterns like $200 or 200 dollars)
  const amountMatch = lowerTranscript.match(/\$?(\d+(?:,\d+)*(?:\.\d+)?)/);
  if (amountMatch) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }
  
  // Determine type of transaction
  if (lowerTranscript.includes("transfer") || lowerTranscript.includes("move")) {
    type = "transfer";
    
    // Try to extract source and destination for transfers
    if (lowerTranscript.includes("from")) {
      const fromParts = lowerTranscript.split("from")[1].split("to");
      if (fromParts.length > 1) {
        source = fromParts[0].trim();
        destination = fromParts[1].trim();
      }
    }
  } else if (
    lowerTranscript.includes("expense") || 
    lowerTranscript.includes("spent") || 
    lowerTranscript.includes("paid") ||
    lowerTranscript.includes("buy") ||
    lowerTranscript.includes("purchase")
  ) {
    type = "expense";
    
    // Try to extract vendor/source for expenses
    if (lowerTranscript.includes("from") || lowerTranscript.includes("at") || lowerTranscript.includes("to")) {
      const prepositions = ["from", "at", "to"];
      for (const prep of prepositions) {
        if (lowerTranscript.includes(prep)) {
          const parts = lowerTranscript.split(prep);
          if (parts.length > 1) {
            source = parts[1].split(" ")[1]; // Skip the first word after the preposition
            break;
          }
        }
      }
    }
    
    // Try to extract category for expenses
    const expenseCategories = [
      "office", "supplies", "travel", "meals", "rent", "utilities", 
      "software", "hardware", "marketing", "advertising", "salary", "payroll"
    ];
    
    for (const cat of expenseCategories) {
      if (lowerTranscript.includes(cat)) {
        category = cat;
        break;
      }
    }
  } else {
    type = "income";
    
    // Try to extract client/source for income
    if (lowerTranscript.includes("from")) {
      const parts = lowerTranscript.split("from");
      if (parts.length > 1) {
        source = parts[1].trim().split(" ")[0]; // Get the first word after "from"
      }
    }
    
    // Try to extract category for income
    const incomeCategories = [
      "sales", "consulting", "service", "revenue", "interest", "dividend"
    ];
    
    for (const cat of incomeCategories) {
      if (lowerTranscript.includes(cat)) {
        category = cat;
        break;
      }
    }
  }
  
  // Try to extract date
  const months = [
    "january", "february", "march", "april", "may", "june", 
    "july", "august", "september", "october", "november", "december"
  ];
  
  for (const month of months) {
    if (lowerTranscript.includes(month)) {
      const monthIndex = months.indexOf(month);
      const dayMatch = lowerTranscript.substr(lowerTranscript.indexOf(month)).match(/\d+/);
      
      if (dayMatch) {
        const day = parseInt(dayMatch[0]);
        date = new Date();
        date.setMonth(monthIndex);
        date.setDate(day);
      } else {
        date = new Date();
        date.setMonth(monthIndex);
        date.setDate(1);
      }
      break;
    }
  }
  
  // If no specific date was found but there's a reference to a date
  if (!date && lowerTranscript.includes("today")) {
    date = new Date();
  } else if (!date && lowerTranscript.includes("yesterday")) {
    date = new Date();
    date.setDate(date.getDate() - 1);
  }
  
  // Generate a description
  let description = "";
  if (type === "expense") {
    description = `Expense ${category ? `for ${category}` : ""} ${source ? `at ${source}` : ""}`;
  } else if (type === "income") {
    description = `Income ${category ? `from ${category}` : ""} ${source ? `from ${source}` : ""}`;
  } else {
    description = `Transfer ${source ? `from ${source}` : ""} ${destination ? `to ${destination}` : ""}`;
  }
  
  // Simulate a small delay to mimic API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    type,
    amount,
    source,
    destination,
    date,
    category,
    description: description.trim()
  };
};

// Typescript declaration for SpeechRecognition API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
