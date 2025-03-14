
import { extractEntity } from '../entityExtractor';

describe('entityExtractor', () => {
  test('should extract entity from text with filler words', () => {
    expect(extractEntity('the amazon')).toBe('amazon');
    expect(extractEntity('a walmart store')).toBe('walmart store');
    expect(extractEntity('my chase bank account')).toBe('chase bank');
    expect(extractEntity('an office depot purchase')).toBe('office depot');
  });

  test('should limit entity to first three words', () => {
    expect(extractEntity('chase bank credit card payment')).toBe('chase bank credit');
    expect(extractEntity('amazon web services monthly subscription')).toBe('amazon web services');
  });

  test('should handle empty or undefined input', () => {
    expect(extractEntity('')).toBeUndefined();
    expect(extractEntity(undefined as unknown as string)).toBeUndefined();
  });

  test('should preserve capitalization', () => {
    expect(extractEntity('Apple Store')).toBe('Apple Store');
    expect(extractEntity('the Home Depot')).toBe('Home Depot');
  });
});
