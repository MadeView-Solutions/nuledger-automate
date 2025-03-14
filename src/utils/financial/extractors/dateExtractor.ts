
/**
 * Utility for extracting dates from financial voice commands
 */

/**
 * Improved date extraction from transcript
 */
export function extractDate(transcript: string): Date | undefined {
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
