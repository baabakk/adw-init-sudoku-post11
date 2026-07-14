/**
 * Server-side sanitization for user-supplied player names.
 * Trims whitespace, strips control/HTML-significant characters, and enforces a length cap
 * so the value is safe to persist and to render later without further escaping surprises.
 */

const MAX_PLAYER_NAME_LENGTH = 32;

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

function stripControlCharacters(value: string): string {
  let result = "";
  for (const char of value) {
    const codePoint = char.codePointAt(0) ?? 0;
    const isControl = codePoint <= 0x1f || codePoint === 0x7f;
    if (!isControl) {
      result += char;
    }
  }
  return result;
}

/**
 * Sanitizes a raw player name string for safe storage and display.
 * Throws if the resulting name is empty after sanitization.
 */
export function sanitizePlayerName(rawName: unknown): string {
  if (typeof rawName !== "string") {
    throw new Error("playerName must be a string");
  }

  const withoutControlChars = stripControlCharacters(rawName);
  const trimmed = withoutControlChars.trim().replace(/\s+/g, " ");
  const truncated = trimmed.slice(0, MAX_PLAYER_NAME_LENGTH);
  const sanitized = escapeHtml(truncated);

  if (sanitized.length === 0) {
    throw new Error("playerName must not be empty");
  }

  return sanitized;
}
