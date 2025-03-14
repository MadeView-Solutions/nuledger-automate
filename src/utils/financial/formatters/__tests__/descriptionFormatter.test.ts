
import { generateDescription } from '../descriptionFormatter';

describe('descriptionFormatter', () => {
  test('should format expense descriptions correctly', () => {
    expect(generateDescription('expense', 50)).toBe('Expense of $50');
    expect(generateDescription('expense', 50, 'food')).toBe('Expense of $50 for food');
    expect(generateDescription('expense', 50, 'food', 'Restaurant')).toBe('Expense of $50 for food at Restaurant');
    
    const testDate = new Date(2023, 0, 15); // Jan 15, 2023
    expect(generateDescription('expense', 50, 'food', 'Restaurant', undefined, testDate))
      .toBe('Expense of $50 for food at Restaurant on 1/15/2023');
  });

  test('should format income descriptions correctly', () => {
    expect(generateDescription('income', 1000)).toBe('Income of $1000');
    expect(generateDescription('income', 1000, 'salary')).toBe('Income of $1000 for salary');
    expect(generateDescription('income', 1000, 'salary', 'Company Inc')).toBe('Income of $1000 for salary from Company Inc');
    
    const testDate = new Date(2023, 0, 15); // Jan 15, 2023
    expect(generateDescription('income', 1000, 'salary', 'Company Inc', undefined, testDate))
      .toBe('Income of $1000 for salary from Company Inc on 1/15/2023');
  });

  test('should format transfer descriptions correctly', () => {
    expect(generateDescription('transfer', 500)).toBe('Transfer of $500');
    
    expect(generateDescription('transfer', 500, undefined, 'Checking')).toBe('Transfer of $500 from Checking');
    expect(generateDescription('transfer', 500, undefined, undefined, 'Savings')).toBe('Transfer of $500 to Savings');
    
    expect(generateDescription('transfer', 500, undefined, 'Checking', 'Savings'))
      .toBe('Transfer of $500 from Checking to Savings');
    
    expect(generateDescription('transfer', 500, 'monthly transfer', 'Checking', 'Savings'))
      .toBe('Transfer of $500 for monthly transfer from Checking to Savings');
    
    const testDate = new Date(2023, 0, 15); // Jan 15, 2023
    expect(generateDescription('transfer', 500, 'monthly transfer', 'Checking', 'Savings', testDate))
      .toBe('Transfer of $500 for monthly transfer from Checking to Savings on 1/15/2023');
  });
});
