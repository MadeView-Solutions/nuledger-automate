
import { extractExpenseCategory, extractIncomeCategory } from '../categoryExtractor';

describe('categoryExtractor', () => {
  describe('extractExpenseCategory', () => {
    test('should extract expense categories from transcript', () => {
      expect(extractExpenseCategory('Spent $50 on office supplies')).toBe('office supplies');
      expect(extractExpenseCategory('Paid $80 for transportation')).toBe('transportation');
      expect(extractExpenseCategory('Expense for software subscription')).toBe('software');
    });

    test('should prioritize longer category matches over shorter ones', () => {
      // "office supplies" should match before just "office"
      expect(extractExpenseCategory('Bought office supplies for the team')).toBe('office supplies');
      // "healthcare" should match before "care"
      expect(extractExpenseCategory('Medical healthcare expenses')).toBe('healthcare');
    });

    test('should return undefined if no category is found', () => {
      expect(extractExpenseCategory('Something unrelated to expenses')).toBeUndefined();
    });
  });

  describe('extractIncomeCategory', () => {
    test('should extract income categories from transcript', () => {
      expect(extractIncomeCategory('Received salary from company')).toBe('salary');
      expect(extractIncomeCategory('Got a commission payment')).toBe('commission');
      expect(extractIncomeCategory('Bonus payment received')).toBe('bonus');
    });

    test('should prioritize longer category matches over shorter ones', () => {
      // "side hustle" should match before just "side"
      expect(extractIncomeCategory('Income from my side hustle')).toBe('side hustle');
      // "social security" should match before just "social"
      expect(extractIncomeCategory('Got my social security payment')).toBe('social security');
    });

    test('should return undefined if no category is found', () => {
      expect(extractIncomeCategory('Something unrelated to income')).toBeUndefined();
    });
  });
});
