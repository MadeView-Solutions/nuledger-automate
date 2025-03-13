
export type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isTyping?: boolean;
  fullContent?: string; // Store the full message content for typing animation
};

// Sample pre-defined responses
export const botResponses: Record<string, string> = {
  "hello": "Hello! I'm your AI financial assistant. How can I help you today?",
  "help": "I can help with financial queries, accounting questions, tax information, and more. Just ask away!",
  "tax deadline": "For most individuals in the US, the tax filing deadline is April 15th. However, if this falls on a weekend or holiday, it may be extended to the next business day.",
  "profit margin": "Profit margin is calculated by dividing your net profit by revenue, then multiplying by 100 to get a percentage. This shows how much of each dollar in revenue becomes profit.",
  "cash flow": "Cash flow is the net amount of cash moving in and out of your business. Positive cash flow indicates more money coming in than going out, which is essential for financial stability.",
  "depreciation": "Depreciation is an accounting method to allocate the cost of a tangible asset over its useful life. It represents how much of an asset's value has been used up over time.",
  "invoice": "I can help you create and manage invoices through our invoicing system. Would you like me to show you how to create a new invoice?",
  "balance sheet": "A balance sheet provides a snapshot of your company's financial position at a specific point in time, showing assets, liabilities, and equity.",
  "deductions": "Common business deductions include office expenses, travel costs, employee benefits, insurance premiums, and professional development. Do you have a specific category you'd like to explore?",
  "reconcile": "To reconcile a bank statement, compare your financial records with the bank's statement, identify and explain any differences, and make adjustments as needed. Would you like me to guide you through this process step by step?",
  "generate report": "I can generate various financial reports based on your data. Would you like a profit and loss statement, balance sheet, cash flow report, or something else?",
  "create invoice": "I can help create an invoice for you. Please provide the client name, services/products, amounts, and any additional details you'd like to include."
};

// Expanded categories for the Help dialog
export const helpCategories = [
  {
    name: "Tax",
    icon: "FileText",
    questions: [
      "When is my tax deadline?",
      "What tax deductions can I claim?",
      "How do I file for a tax extension?",
      "What is the difference between tax credits and deductions?"
    ]
  },
  {
    name: "Accounting",
    icon: "BookText",
    questions: [
      "How do I reconcile my bank statement?",
      "What is depreciation?",
      "How do I calculate profit margin?",
      "What should be included in a balance sheet?"
    ]
  },
  {
    name: "Cash Flow",
    icon: "HelpCircle",
    questions: [
      "How do I improve my cash flow?",
      "What's the difference between profit and cash flow?",
      "How do I forecast my cash flow?",
      "What are accounts receivable best practices?"
    ]
  }
];

// Get response based on user input
export const getResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Check for exact matches
  for (const [key, value] of Object.entries(botResponses)) {
    if (lowercaseInput.includes(key)) {
      return value;
    }
  }
  
  // Default responses if no match found
  if (lowercaseInput.includes("thank")) {
    return "You're welcome! Is there anything else I can help you with?";
  } else if (lowercaseInput.includes("?")) {
    return "That's a good question. While I don't have the specific answer right now, I can help you analyze your financial data to find this information. Would you like me to do that?";
  } else {
    return "I'm not sure I understand. Could you rephrase your question about your financial situation or accounting needs?";
  }
};
