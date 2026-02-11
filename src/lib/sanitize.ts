/**
 * Escapes markdown special characters to prevent injection
 * when embedding user input into markdown blocks.
 */
export function escapeMarkdown(input: string): string {
  return input.replace(/([#*\[\]`~>\\|!])/g, "\\$1");
}

/** Max lengths for user-provided fields */
export const MAX_LENGTHS = {
  title: 200,
  description: 500,
  location: 300,
  participantName: 100,
} as const;

/**
 * Sanitizes a user-provided string:
 * - Trims whitespace
 * - Enforces max length
 * - Escapes markdown control characters
 */
export function sanitizeInput(
  input: string,
  maxLength: number
): string {
  const trimmed = input.trim().slice(0, maxLength);
  return escapeMarkdown(trimmed);
}
