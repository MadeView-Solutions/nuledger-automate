
/**
 * Utility for formatting financial entry descriptions
 */

/**
 * Generate a more detailed description based on available information
 */
export function generateDescription(
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
