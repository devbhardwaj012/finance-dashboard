/**
 * Recursively flattens any JSON object into dot-notation paths.
 *
 * Examples:
 *  { a: { b: 1 } }        → { "a.b": 1 }
 *  { arr: [{ x: 1 }] }   → { "arr.0.x": 1 }
 *
 * Rules:
 * - Keeps primitives (string, number, boolean)
 * - Traverses objects & arrays
 * - Skips null / undefined safely
 */

export function flattenJson(input, prefix = "", result = {}) {
  if (input === null || input === undefined) {
    return result;
  }

  // Primitive value → store
  if (
    typeof input === "string" ||
    typeof input === "number" ||
    typeof input === "boolean"
  ) {
    result[prefix] = input;
    return result;
  }

  // Array → recurse with index
  if (Array.isArray(input)) {
    input.forEach((item, index) => {
      const path = prefix ? `${prefix}.${index}` : `${index}`;
      flattenJson(item, path, result);
    });
    return result;
  }

  // Object → recurse keys
  if (typeof input === "object") {
    Object.entries(input).forEach(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      flattenJson(value, path, result);
    });
  }

  return result;
}
