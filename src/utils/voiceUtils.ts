
// Re-export types and functions from the refactored files
export { FinancialEntry } from './financial/financialTypes';
export { parseFinancialEntry } from './financial/parseFinancialEntry';
export type { 
  SpeechRecognition, 
  SpeechRecognitionEvent, 
  SpeechRecognitionResult, 
  SpeechRecognitionResultList, 
  SpeechRecognitionAlternative 
} from './speech/speechTypes';
