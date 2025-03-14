
import { parseFinancialEntry } from '../parseFinancialEntry';
import { extractEntity } from '../extractors/entityExtractor';
import { extractExpenseCategory, extractIncomeCategory } from '../extractors/categoryExtractor';
import { extractDate } from '../extractors/dateExtractor';

// Mock the extractor dependencies
jest.mock('../extractors/entityExtractor');
jest.mock('../extractors/categoryExtractor');
jest.mock('../extractors/dateExtractor');

describe('parseFinancialEntry', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    (extractEntity as jest.Mock).mockImplementation((text) => text ? 'mocked entity' : undefined);
    (extractExpenseCategory as jest.Mock).mockReturnValue('mocked expense category');
    (extractIncomeCategory as jest.Mock).mockReturnValue('mocked income category');
    (extractDate as jest.Mock).mockReturnValue(new Date(2023, 0, 1)); // Jan 1, 2023
  });

  test('should parse expense entries correctly', async () => {
    const result = await parseFinancialEntry('spent $50 on office supplies');
    
    expect(result.type).toBe('expense');
    expect(result.amount).toBe(50);
    expect(result.category).toBe('mocked expense category');
    expect(extractExpenseCategory).toHaveBeenCalled();
    expect(extractIncomeCategory).not.toHaveBeenCalled();
  });

  test('should parse income entries correctly', async () => {
    const result = await parseFinancialEntry('received $1000 salary from company');
    
    expect(result.type).toBe('income');
    expect(result.amount).toBe(1000);
    expect(result.category).toBe('mocked income category');
    expect(extractIncomeCategory).toHaveBeenCalled();
    expect(extractExpenseCategory).not.toHaveBeenCalled();
  });

  test('should parse transfer entries correctly', async () => {
    const result = await parseFinancialEntry('transfer $500 from checking to savings');
    
    expect(result.type).toBe('transfer');
    expect(result.amount).toBe(500);
    expect(result.source).toBe('mocked entity');
    expect(result.destination).toBe('mocked entity');
  });

  test('should extract amount with currency symbol', async () => {
    const result = await parseFinancialEntry('paid $1,234.56 for rent');
    expect(result.amount).toBe(1234.56);
  });

  test('should extract amount without currency symbol', async () => {
    const result = await parseFinancialEntry('paid 1,234.56 for rent');
    expect(result.amount).toBe(1234.56);
  });

  test('should generate proper description', async () => {
    const result = await parseFinancialEntry('spent $50 on office supplies at staples on january 15');
    expect(result.description).toContain('Expense of $50');
    expect(result.description).toContain('mocked expense category');
    expect(result.description).toContain('mocked entity');
  });
});
