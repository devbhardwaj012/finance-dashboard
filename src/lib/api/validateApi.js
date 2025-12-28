/**
 * isTimeSeriesArray
 *
 * Detects whether an array represents time-series data.
 * The function validates both structure and semantics.
 *
 * Detection strategy:
 * - Must be a non-empty array
 * - First element must be a plain object
 * - Object must contain a known date/time field
 * - Date field value must be a valid date string or timestamp
 *
 * This is intentionally conservative to avoid false positives.
 */
function isTimeSeriesArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return false;

  const firstItem = arr[0];
  if (!firstItem || typeof firstItem !== "object" || Array.isArray(firstItem)) {
    return false;
  }

  const dateFields = [
    "datetime",
    "date",
    "time",
    "timestamp",
    "ts",
    "created_at",
    "updated_at",
  ];

  const keys = Object.keys(firstItem);
  const dateField = keys.find((key) =>
    dateFields.includes(key.toLowerCase())
  );

  if (!dateField) return false;

  const dateValue = firstItem[dateField];

  return (
    typeof dateValue === "string" &&
    (/^\d{4}-\d{2}-\d{2}/.test(dateValue) ||
      !isNaN(Date.parse(dateValue)))
  );
}

/**
 * convertArrayToSeries
 *
 * Converts array-based time-series data into an object keyed by date.
 *
 * Example:
 * Input:
 *   [{ date: "2024-01-01", price: "100" }, ...]
 *
 * Output:
 *   {
 *     "2024-01-01": { price: 100 }
 *   }
 *
 * Numeric strings are converted to numbers to ensure
 * compatibility with charting libraries.
 */
function convertArrayToSeries(arr) {
  const result = {};

  const dateFields = [
    "datetime",
    "date",
    "time",
    "timestamp",
    "ts",
    "created_at",
    "updated_at",
  ];

  const firstItem = arr[0];
  const keys = Object.keys(firstItem);
  const dateField = keys.find((key) =>
    dateFields.includes(key.toLowerCase())
  );

  if (!dateField) return null;

  arr.forEach((item) => {
    const dateKey = item[dateField];
    const dataPoint = { ...item };
    delete dataPoint[dateField];

    Object.keys(dataPoint).forEach((key) => {
      const val = dataPoint[key];
      if (
        typeof val === "string" &&
        val.trim() !== "" &&
        !isNaN(Number(val))
      ) {
        dataPoint[key] = Number(val);
      }
    });

    result[dateKey] = dataPoint;
  });

  return result;
}

/**
 * validateApi
 *
 * Validates an API endpoint and analyzes its response structure.
 *
 * Responsibilities:
 * - Fetch API data via server-side proxy
 * - Traverse the response recursively
 * - Categorize fields into:
 *   - scalars: primitive values
 *   - arrays: array-based collections
 *   - series: time-series compatible data
 *
 * This function defines the core data contract
 * for widget creation across the dashboard.
 */
export async function validateApi(
  url,
  apiKey = null,
  apiKeyHeader = "X-Api-Key",
  apiKeyPrefix = ""
) {
  try {
    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, apiKey, apiKeyHeader, apiKeyPrefix }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP ${res.status}`);
    }

    const json = await res.json();

    const scalars = {};
    const arrays = {};
    const series = {};

    /**
     * Detects object-based time series where
     * keys themselves are date strings.
     */
    function isTimeSeriesObject(obj) {
      if (!obj || typeof obj !== "object") return false;

      const keys = Object.keys(obj);
      if (keys.length === 0) return false;

      const dateKeys = keys.filter((k) =>
        /^\d{4}-\d{2}-\d{2}/.test(k)
      );

      return dateKeys.length / keys.length > 0.7;
    }

    /**
     * Recursive traversal of the API response.
     * Builds dot-notation paths for every field discovered.
     */
    function walk(node, path = "") {
      if (node === null || node === undefined) return;

      if (Array.isArray(node)) {
        if (isTimeSeriesArray(node)) {
          const converted = convertArrayToSeries(node);
          if (converted) {
            series[path] = converted;
            return;
          }
        }

        if (node.length && typeof node[0] === "object") {
          arrays[path] = node;
        }

        return;
      }

      if (typeof node === "object") {
        if (isTimeSeriesObject(node)) {
          series[path] = node;
          return;
        }

        Object.entries(node).forEach(([key, value]) => {
          const nextPath = path ? `${path}.${key}` : key;
          walk(value, nextPath);
        });

        return;
      }

      scalars[path] = node;
    }

    walk(json);

    return {
      ok: true,
      raw: json,
      scalars,
      arrays,
      series,
      totalFields:
        Object.keys(scalars).length +
        Object.keys(arrays).length +
        Object.keys(series).length,
      allPaths: getAllPaths(json),
    };
  } catch (err) {
    return {
      ok: false,
      error: { message: err?.message || "Failed to connect" },
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Helper Utilities                                                            */
/* -------------------------------------------------------------------------- */

/**
 * readPath
 *
 * Safely resolves a dot-notation path against an object.
 * Returns undefined if the path cannot be fully resolved.
 */
export function readPath(obj, path) {
  if (!path || !obj) return undefined;

  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current == null || typeof current !== "object") {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

/**
 * getAllPaths
 *
 * Generates all object paths up to a specified depth.
 * Used to power field discovery and search UI.
 */
export function getAllPaths(
  obj,
  prefix = "",
  maxDepth = 5,
  currentDepth = 0
) {
  const paths = [];

  if (
    currentDepth >= maxDepth ||
    !obj ||
    typeof obj !== "object" ||
    Array.isArray(obj)
  ) {
    return paths;
  }

  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    paths.push(fullPath);

    if (value && typeof value === "object" && !Array.isArray(value)) {
      paths.push(
        ...getAllPaths(value, fullPath, maxDepth, currentDepth + 1)
      );
    }
  }

  return paths;
}

/**
 * fetchApi
 *
 * Local helper mirroring the proxy-based fetch logic.
 * Preserved intentionally for compatibility.
 */
export async function fetchApi(
  url,
  apiKey = null,
  apiKeyHeader = "X-Api-Key",
  apiKeyPrefix = ""
) {
  const res = await fetch("/api/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, apiKey, apiKeyHeader, apiKeyPrefix }),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}
