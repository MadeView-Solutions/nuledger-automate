
/**
 * Utility for extracting entities from financial voice commands
 */

/**
 * Extracts a meaningful entity name from text
 */
export function extractEntity(text: string): string | undefined {
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
