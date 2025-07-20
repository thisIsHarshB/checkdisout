import { isRequired, isValidEmail } from '@/lib/utils/validation';

describe('Validation Utils', () => {
  it('isRequired returns true for non-empty values', () => {
    expect(isRequired('test')).toBe(true);
    expect(isRequired(123)).toBe(true);
    expect(isRequired([])).toBe(true);
  });
  it('isRequired returns false for empty values', () => {
    expect(isRequired('')).toBe(false);
    expect(isRequired(null)).toBe(false);
    expect(isRequired(undefined)).toBe(false);
  });
  it('isValidEmail validates email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });
}); 