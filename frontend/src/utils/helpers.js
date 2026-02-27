/**
 * Extract initials from a doctor name (strips "Dr." prefix).
 * e.g. "Dr Jaswin D'Souza" → "JD"
 */
export function getInitials(name) {
  return name
    .replace(/^Dr\.?\s*/i, '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
