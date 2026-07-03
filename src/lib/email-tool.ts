/**
 * Utility to generate a mailto link with prefilled fields.
 * Returns a markdown link that can be displayed to the user.
 */
export function generateEmailLink(to: string, cc: string | undefined, subject: string, body: string): string {
  const params = new URLSearchParams();
  if (cc) params.set('cc', cc);
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const paramString = params.toString();
  const mailto = `mailto:${encodeURIComponent(to)}${paramString ? '?' + paramString : ''}`;
  return `[📧 Clique aqui para abrir este e‑mail](${mailto})`;
}
