export function isRequired(value: any): boolean {
  return value !== undefined && value !== null && value !== '';
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getFieldError(value: any, rules: Array<(v: any) => boolean>, messages: string[]): string | null {
  for (let i = 0; i < rules.length; i++) {
    if (!rules[i](value)) {
      return messages[i];
    }
  }
  return null;
} 