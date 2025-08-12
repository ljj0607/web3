export function validateMessage(message: string): { valid: boolean; error?: string } {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (message.length > 4000) {
    return { valid: false, error: 'Message is too long (max 4000 characters)' };
  }

  return { valid: true };
}

export function sanitizeMessage(message: string): string {
  return message.trim();
}