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
export async function validateApi(url, apiKey = null, apiKeyHeader = "X-Api-Key", apiKeyPrefix = "") {
  try {
    const headers = getHeadersForApi(url, apiKey, apiKeyHeader, apiKeyPrefix);
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