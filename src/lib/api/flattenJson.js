// /**
//  * Recursively flattens any JSON object into dot-notation paths.
//  *
//  * Examples:
//  *  { a: { b: 1 } }        → { "a.b": 1 }
//  *  { arr: [{ x: 1 }] }   → { "arr.0.x": 1 }
//  *
//  * Extended:
//  * - Collects array paths separately (for table widgets)
//  */

// export function flattenJson(
//   input,
//   prefix = "",
//   result = {},
//   arrayPaths = new Set()
// ) {
//   if (input === null || input === undefined) {
//     return result;
//   }

//   // Primitive value → store
//   if (
//     typeof input === "string" ||
//     typeof input === "number" ||
//     typeof input === "boolean"
//   ) {
//     if (prefix) result[prefix] = input;
//     return result;
//   }

//   // Array → record path + recurse first element for schema
//   if (Array.isArray(input)) {
//     if (prefix) arrayPaths.add(prefix);

//     // Only inspect first element for field discovery
//     if (input.length > 0) {
//       flattenJson(input[0], prefix, result, arrayPaths);
//     }
//     return result;
//   }

//   // Object → recurse keys
//   if (typeof input === "object") {
//     Object.entries(input).forEach(([key, value]) => {
//       const path = prefix ? `${prefix}.${key}` : key;
//       flattenJson(value, path, result, arrayPaths);
//     });
//   }

//   return result;
// }














// the correct one is above 



















/**
 * Flattens JSON into dot paths for scalar values
 */
export function flattenJson(input, prefix = "", result = {}) {
  if (input == null) return result;

  if (
    typeof input === "string" ||
    typeof input === "number" ||
    typeof input === "boolean"
  ) {
    result[prefix] = input;
    return result;
  }

  if (Array.isArray(input)) {
    input.forEach((v, i) => {
      flattenJson(v, prefix ? `${prefix}.${i}` : `${i}`, result);
    });
    return result;
  }

  if (typeof input === "object") {
    Object.entries(input).forEach(([k, v]) => {
      flattenJson(v, prefix ? `${prefix}.${k}` : k, result);
    });
  }

  return result;
}

