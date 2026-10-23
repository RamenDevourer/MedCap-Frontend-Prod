// Flattens an AI-returned value (string, list or object) to a single line of text.
export const asText = (value) => {
  if (value === null || value === undefined || value === '') return null;
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return Object.values(value).join(', ');
  return String(value);
};

