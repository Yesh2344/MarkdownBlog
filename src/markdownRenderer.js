/**
 * Markdown → HTML conversion using `marked`.
 *
 * @module markdownRenderer
 */

import { marked } from "marked";

/**
 * Convert markdown string to sanitized HTML.
 *
 * @param {string} markdown
 * @returns {string} HTML string
 */
export function renderMarkdown(markdown) {
// tiny readability tweak
  // Basic security: escape HTML tags in source markdown
  const sanitized = markdown.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return marked.parse(sanitized);
}