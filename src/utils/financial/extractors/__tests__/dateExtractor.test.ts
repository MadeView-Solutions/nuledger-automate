
import { extractDate } from '../dateExtractor';

describe('dateExtractor', () => {
  // Mocking current date to ensure consistent test results
  const originalDate = global.Date;
  
  beforeAll(() => {
    // Mock the current date to be 2023-10-15
    const mockDate = new Date(2023, 9, 15); // Note: month is 0-indexed
    
    // Properly extend the Date class with a super() call
    global.Date = class extends originalDate {
      constructor(date) {
        if (date) {
          super(date);
        } else {
          super(mockDate.getTime());
        }
      }
    } as any;
  });

  afterAll(() => {
    global.Date = originalDate;
  });

  test('should extract full month and day format', () => {
    const result = extractDate('expense on January 15');
    expect(result?.getMonth()).toBe(0); // January is 0
    expect(result?.getDate()).toBe(15);
    expect(result?.getFullYear()).toBe(2023); // Current year if no year specified
  });

  test('should extract abbreviated month format', () => {
    const result = extractDate('payment on Feb 28');
    expect(result?.getMonth()).toBe(1); // February is 1
    expect(result?.getDate()).toBe(28);
  });

  test('should extract month with year', () => {
    const result = extractDate('invoice paid on March 10, 2022');
    expect(result?.getMonth()).toBe(2); // March is 2
    expect(result?.getDate()).toBe(10);
    expect(result?.getFullYear()).toBe(2022);
  });

  test('should handle abbreviated year format', () => {
    const result = extractDate('payment on Apr 5, \'21');
    expect(result?.getMonth()).toBe(3); // April is 3
    expect(result?.getDate()).toBe(5);
    expect(result?.getFullYear()).toBe(2021);
  });

  test('should handle relative dates', () => {
    // Today
    let result = extractDate('expense made today');
    expect(result?.toDateString()).toBe(new Date().toDateString());
    
    // Yesterday
    result = extractDate('payment from yesterday');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(result?.toDateString()).toBe(yesterday.toDateString());
    
    // Tomorrow
    result = extractDate('will pay tomorrow');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(result?.toDateString()).toBe(tomorrow.toDateString());
  });

  test('should handle days of week', () => {
    // This test would depend on what day of the week the mock date is
    // For our mock (2023-10-15), it's a Sunday
    
    // Monday should be Oct 16, 2023
    let result = extractDate('meeting on Monday');
    expect(result?.getMonth()).toBe(9); // October is 9
    expect(result?.getDate()).toBe(16);
    
    // Last Friday should be Oct 13, 2023
    result = extractDate('expense from last Friday');
    expect(result?.getMonth()).toBe(9);
    expect(result?.getDate()).toBe(13);
  });

  test('should return undefined for no date information', () => {
    expect(extractDate('no date information here')).toBeUndefined();
  });
});
