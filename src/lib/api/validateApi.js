
// import { getHeadersForApi } from "./apiConfig";

// /**
//  * Helper to safely read nested paths
//  */
// export function readPath(obj, path) {
//   if (!path || !obj) return undefined;
//   return path.split(".").reduce((acc, key) => {
//     if (acc === null || acc === undefined) return undefined;
//     return acc[key];
//   }, obj);
// }

// /**
//  * validateApi - Analyze API response structure
//  */
// export async function validateApi(url) {
//   try {
//     const headers = getHeadersForApi(url);
//     const res = await fetch(url, { headers });

//     if (!res.ok) {
//       throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//     }

//     const json = await res.json();

//     const scalars = {};
//     const arrays = {};
//     const series = {};

//     function isTimeSeriesObject(obj) {
//       const keys = Object.keys(obj);
//       if (!keys.length) return false;
//       // Check if most keys are date-like
//       const dateKeys = keys.filter(k => /^\d{4}-\d{2}-\d{2}/.test(k));
//       return dateKeys.length > 0 && dateKeys.length / keys.length > 0.8;
//     }

//     function walk(node, path = "") {
//       if (node === null || node === undefined) return;

//       // ARRAY → table source
//       if (Array.isArray(node)) {
//         if (node.length && typeof node[0] === "object" && !Array.isArray(node[0])) {
//           arrays[path] = node;
//         }
//         return; // Don't recurse into array items
//       }

//       // OBJECT
//       if (typeof node === "object") {
//         // Time-series detection
//         if (isTimeSeriesObject(node)) {
//           series[path] = node;
//           return; // Don't recurse into time series
//         }

//         // Regular object - recurse
//         Object.entries(node).forEach(([key, value]) => {
//           const nextPath = path ? `${path}.${key}` : key;
//           walk(value, nextPath);
//         });
//         return;
//       }

//       // PRIMITIVE → scalar
//       scalars[path] = node;
//     }

//     walk(json);

//     const totalFields =
//       Object.keys(scalars).length +
//       Object.keys(arrays).length +
//       Object.keys(series).length;

//     return {
//       ok: true,
//       raw: json,
//       scalars,
//       arrays,
//       series,
//       totalFields,
//     };
//   } catch (err) {
//     return {
//       ok: false,
//       error: { message: err?.message || "Failed to connect" },
//     };
//   }
// }

















// just added 






// import { getHeadersForApi } from "./apiConfig";

// /**
//  * Robust path reader that handles ANY key structure
//  */
// export function readPath(obj, path) {
//   if (!path || !obj) return undefined;
  
//   // Handle simple keys without dots
//   if (!path.includes('.')) {
//     return obj[path];
//   }
  
//   // Split path and traverse
//   const keys = path.split('.');
//   let current = obj;
  
//   for (const key of keys) {
//     if (current === null || current === undefined) return undefined;
//     if (typeof current !== 'object') return undefined;
    
//     // Direct key access
//     if (key in current) {
//       current = current[key];
//     } else {
//       return undefined;
//     }
//   }
  
//   return current;
// }

// /**
//  * Get ALL possible paths in an object (for debugging)
//  */
// export function getAllPaths(obj, prefix = '', maxDepth = 5, currentDepth = 0) {
//   const paths = [];
  
//   if (currentDepth >= maxDepth) return paths;
//   if (!obj || typeof obj !== 'object') return paths;
  
//   for (const [key, value] of Object.entries(obj)) {
//     const fullPath = prefix ? `${prefix}.${key}` : key;
//     paths.push(fullPath);
    
//     if (value && typeof value === 'object' && !Array.isArray(value)) {
//       paths.push(...getAllPaths(value, fullPath, maxDepth, currentDepth + 1));
//     }
//   }
  
//   return paths;
// }

// /**
//  * Enhanced validateApi - Returns EXACT paths that work
//  */
// export async function validateApi(url) {
//   try {
//     const headers = getHeadersForApi(url);
//     const res = await fetch(url, { headers });

//     if (!res.ok) {
//       throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//     }

//     const json = await res.json();

//     const scalars = {};
//     const arrays = {};
//     const series = {};

//     function isTimeSeriesObject(obj) {
//       if (!obj || typeof obj !== 'object') return false;
//       const keys = Object.keys(obj);
//       if (keys.length === 0) return false;
      
//       // Check if most keys look like dates
//       const dateKeys = keys.filter(k => 
//         /^\d{4}-\d{2}-\d{2}/.test(k) || // YYYY-MM-DD
//         /^\d{4}\/\d{2}\/\d{2}/.test(k) || // YYYY/MM/DD
//         /^\d{2}-\d{2}-\d{4}/.test(k)     // DD-MM-YYYY
//       );
//       return dateKeys.length > 0 && dateKeys.length / keys.length > 0.7;
//     }

//     function walk(node, path = "") {
//       if (node === null || node === undefined) return;

//       // ARRAY → table source
//       if (Array.isArray(node)) {
//         if (node.length && typeof node[0] === "object" && !Array.isArray(node[0])) {
//           arrays[path] = node;
//         }
//         return;
//       }

//       // OBJECT
//       if (typeof node === "object") {
//         // Time-series detection
//         if (isTimeSeriesObject(node)) {
//           series[path] = node;
//           return;
//         }

//         // Recurse into object properties
//         Object.entries(node).forEach(([key, value]) => {
//           const nextPath = path ? `${path}.${key}` : key;
//           walk(value, nextPath);
//         });
//         return;
//       }

//       // PRIMITIVE → scalar
//       scalars[path] = node;
//     }

//     walk(json);

//     const totalFields =
//       Object.keys(scalars).length +
//       Object.keys(arrays).length +
//       Object.keys(series).length;

//     // Debug: Log all paths found
//     console.log('=== VALIDATE API DEBUG ===');
//     console.log('Scalars:', Object.keys(scalars));
//     console.log('Arrays:', Object.keys(arrays));
//     console.log('Series:', Object.keys(series));
//     console.log('All possible paths:', getAllPaths(json));
//     console.log('=========================');

//     return {
//       ok: true,
//       raw: json,
//       scalars,
//       arrays,
//       series,
//       totalFields,
//       allPaths: getAllPaths(json), // Include for debugging
//     };
//   } catch (err) {
//     return {
//       ok: false,
//       error: { message: err?.message || "Failed to connect" },
//     };
//   }
// }






















// second claude 




// // =====================================================================
// // FIXED: readPath now handles keys with spaces, parentheses, dots, etc.
// // =====================================================================

// import { getHeadersForApi } from "./apiConfig";

// /**
//  * BULLETPROOF path reader - handles ANY characters in keys
//  * Works with: "Time Series (Daily)", "Meta Data", "1. open", etc.
//  */
// export function readPath(obj, path) {
//   if (!path || !obj) return undefined;
  
//   // CRITICAL FIX: Check if the ENTIRE path exists as a single key first
//   // This handles cases like "Time Series (Daily)" which shouldn't be split
//   if (path in obj) {
//     return obj[path];
//   }
  
//   // Only split by dot if the direct key doesn't exist
//   if (!path.includes('.')) {
//     return undefined; // Key doesn't exist
//   }
  
//   // Try splitting by dots for nested paths like "data.results.items"
//   const keys = path.split('.');
//   let current = obj;
  
//   for (const key of keys) {
//     if (current === null || current === undefined) return undefined;
//     if (typeof current !== 'object') return undefined;
    
//     if (key in current) {
//       current = current[key];
//     } else {
//       return undefined;
//     }
//   }
  
//   return current;
// }

// /**
//  * Get ALL possible paths in an object (for debugging)
//  */
// export function getAllPaths(obj, prefix = '', maxDepth = 5, currentDepth = 0) {
//   const paths = [];
  
//   if (currentDepth >= maxDepth) return paths;
//   if (!obj || typeof obj !== 'object') return paths;
  
//   for (const [key, value] of Object.entries(obj)) {
//     // Store paths WITHOUT adding prefix if it would create dots in special keys
//     // For keys like "Time Series (Daily)", store them as-is, not "root.Time Series (Daily)"
//     const fullPath = prefix ? `${prefix}.${key}` : key;
//     paths.push(fullPath);
    
//     if (value && typeof value === 'object' && !Array.isArray(value)) {
//       paths.push(...getAllPaths(value, fullPath, maxDepth, currentDepth + 1));
//     }
//   }
  
//   return paths;
// }

// /**
//  * Enhanced validateApi - Returns EXACT paths that work
//  */
// export async function validateApi(url) {
//   try {
//     const headers = getHeadersForApi(url);
//     const res = await fetch(url, { headers });

//     if (!res.ok) {
//       throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//     }

//     const json = await res.json();

//     const scalars = {};
//     const arrays = {};
//     const series = {};

//     function isTimeSeriesObject(obj) {
//       if (!obj || typeof obj !== 'object') return false;
//       const keys = Object.keys(obj);
//       if (keys.length === 0) return false;
      
//       // Check if most keys look like dates
//       const dateKeys = keys.filter(k => 
//         /^\d{4}-\d{2}-\d{2}/.test(k) || // YYYY-MM-DD
//         /^\d{4}\/\d{2}\/\d{2}/.test(k) || // YYYY/MM/DD
//         /^\d{2}-\d{2}-\d{4}/.test(k)     // DD-MM-YYYY
//       );
//       return dateKeys.length > 0 && dateKeys.length / keys.length > 0.7;
//     }

//     function walk(node, path = "") {
//       if (node === null || node === undefined) return;

//       // ARRAY → table source
//       if (Array.isArray(node)) {
//         if (node.length && typeof node[0] === "object" && !Array.isArray(node[0])) {
//           arrays[path] = node;
//         }
//         return;
//       }

//       // OBJECT
//       if (typeof node === "object") {
//         // Time-series detection
//         if (isTimeSeriesObject(node)) {
//           series[path] = node;
//           return;
//         }

//         // Recurse into object properties
//         Object.entries(node).forEach(([key, value]) => {
//           // CRITICAL: Don't add dot prefix for root-level keys
//           // This ensures "Time Series (Daily)" stays as-is, not ".Time Series (Daily)"
//           const nextPath = path ? `${path}.${key}` : key;
//           walk(value, nextPath);
//         });
//         return;
//       }

//       // PRIMITIVE → scalar
//       scalars[path] = node;
//     }

//     walk(json);

//     const totalFields =
//       Object.keys(scalars).length +
//       Object.keys(arrays).length +
//       Object.keys(series).length;

//     // Debug: Log all paths found
//     console.log('=== VALIDATE API DEBUG ===');
//     console.log('Scalars:', Object.keys(scalars));
//     console.log('Arrays:', Object.keys(arrays));
//     console.log('Series:', Object.keys(series));
//     console.log('Sample of raw JSON keys:', Object.keys(json));
//     console.log('=========================');

//     return {
//       ok: true,
//       raw: json,
//       scalars,
//       arrays,
//       series,
//       totalFields,
//       allPaths: getAllPaths(json), // Include for debugging
//     };
//   } catch (err) {
//     return {
//       ok: false,
//       error: { message: err?.message || "Failed to connect" },
//     };
//   }
// }














// =====================================================================
// COMPLETE FIX: Handles ALL path formats including "1. Information"
// =====================================================================

import { getHeadersForApi } from "./apiConfig";

/**
 * BULLETPROOF path reader - handles ANY characters in keys
 * Works with: "Time Series (Daily)", "Meta Data", "1. Information", etc.
 * 
 * Examples:
 * - readPath(obj, "Time Series (Daily)") - single key with spaces/parens
 * - readPath(obj, "Meta Data.1. Information") - nested with dots in keys
 * - readPath(obj, "data.items.0") - nested with array index
 */
export function readPath(obj, path) {
  if (!path || !obj) return undefined;
  
  // Strategy 1: Try exact key match first (handles single keys with special chars)
  if (Object.prototype.hasOwnProperty.call(obj, path)) {
    return obj[path];
  }
  
  // Strategy 2: If no dots, it's a simple key that doesn't exist
  if (!path.includes('.')) {
    return undefined;
  }
  
  // Strategy 3: Smart path splitting that handles keys with dots in them
  // We need to try different split strategies because keys can contain dots
  
  // First, try the path as-is by splitting on dots
  const keys = path.split('.');
  let current = obj;
  let found = true;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      found = false;
      break;
    }
    if (typeof current !== 'object') {
      found = false;
      break;
    }
    
    if (Object.prototype.hasOwnProperty.call(current, key)) {
      current = current[key];
    } else {
      found = false;
      break;
    }
  }
  
  if (found) return current;
  
  // Strategy 4: Try combining adjacent parts to handle keys with dots
  // For "Meta Data.1. Information", try ["Meta Data", "1. Information"]
  for (let i = 1; i < keys.length; i++) {
    const firstPart = keys.slice(0, i).join('.');
    const remaining = keys.slice(i);
    
    if (Object.prototype.hasOwnProperty.call(obj, firstPart)) {
      // Found first part, now recurse with remaining path
      const remainingPath = remaining.join('.');
      return readPath(obj[firstPart], remainingPath);
    }
  }
  
  return undefined;
}

/**
 * Get ALL possible paths in an object (for debugging and field selection)
 */
export function getAllPaths(obj, prefix = '', maxDepth = 5, currentDepth = 0) {
  const paths = [];
  
  if (currentDepth >= maxDepth) return paths;
  if (!obj || typeof obj !== 'object') return paths;
  if (Array.isArray(obj)) return paths; // Don't traverse arrays
  
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    paths.push(fullPath);
    
    // Only recurse into plain objects, not arrays or other types
    if (value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0) {
      paths.push(...getAllPaths(value, fullPath, maxDepth, currentDepth + 1));
    }
  }
  
  return paths;
}

/**
 * Enhanced validateApi - Returns EXACT paths that work
 */
export async function validateApi(url) {
  try {
    const headers = getHeadersForApi(url);
    const res = await fetch(url, { headers });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();

    const scalars = {};
    const arrays = {};
    const series = {};

    function isTimeSeriesObject(obj) {
      if (!obj || typeof obj !== 'object') return false;
      const keys = Object.keys(obj);
      if (keys.length === 0) return false;
      
      // Check if most keys look like dates
      const dateKeys = keys.filter(k => 
        /^\d{4}-\d{2}-\d{2}/.test(k) || // YYYY-MM-DD
        /^\d{4}\/\d{2}\/\d{2}/.test(k) || // YYYY/MM/DD
        /^\d{2}-\d{2}-\d{4}/.test(k)     // DD-MM-YYYY
      );
      return dateKeys.length > 0 && dateKeys.length / keys.length > 0.7;
    }

    function walk(node, path = "") {
      if (node === null || node === undefined) return;

      // ARRAY → table source
      if (Array.isArray(node)) {
        if (node.length && typeof node[0] === "object" && !Array.isArray(node[0])) {
          arrays[path] = node;
        }
        return;
      }

      // OBJECT
      if (typeof node === "object") {
        // Time-series detection
        if (isTimeSeriesObject(node)) {
          series[path] = node;
          return;
        }

        // Recurse into object properties
        Object.entries(node).forEach(([key, value]) => {
          const nextPath = path ? `${path}.${key}` : key;
          walk(value, nextPath);
        });
        return;
      }

      // PRIMITIVE → scalar
      scalars[path] = node;
    }

    walk(json);

    const totalFields =
      Object.keys(scalars).length +
      Object.keys(arrays).length +
      Object.keys(series).length;

    // Debug: Log all paths found
    if (process.env.NODE_ENV === 'development') {
      console.log('=== VALIDATE API DEBUG ===');
      console.log('Scalars found:', Object.keys(scalars).length);
      console.log('Sample scalar paths:', Object.keys(scalars).slice(0, 5));
      console.log('Arrays:', Object.keys(arrays));
      console.log('Series:', Object.keys(series));
      console.log('=========================');
    }

    return {
      ok: true,
      raw: json,
      scalars,
      arrays,
      series,
      totalFields,
      allPaths: getAllPaths(json),
    };
  } catch (err) {
    return {
      ok: false,
      error: { message: err?.message || "Failed to connect" },
    };
  }
}