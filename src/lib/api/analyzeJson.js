/**
 * Analyzes raw JSON and extracts:
 * - scalar fields (for Card)
 * - row collections (for Table)
 * - numeric/time series (for Chart)
 */

export function analyzeJsonStructure(json) {
  const scalarFields = {};
  const rowCandidates = {};
  const chartCandidates = {};

  function isPrimitive(v) {
    return (
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean"
    );
  }

  function walk(value, path = "") {
    if (value === null || value === undefined) return;

    // Scalar
    if (isPrimitive(value)) {
      scalarFields[path] = value;
      return;
    }

    // Array → row candidate
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
      rowCandidates[path] = {
        type: "array",
        sample: value[0],
      };
      return;
    }

    // Object
    if (typeof value === "object") {
      const keys = Object.keys(value);

      // Time-series style object: { date: { ... } }
      if (
        keys.length > 1 &&
        keys.every((k) => typeof value[k] === "object")
      ) {
        const sampleKey = keys[0];
        const sampleValue = value[sampleKey];

        if (typeof sampleValue === "object") {
          rowCandidates[path] = {
            type: "object",
            sample: sampleValue,
          };

          // Detect numeric series (for charts)
          Object.entries(sampleValue).forEach(([k, v]) => {
            if (typeof v === "number" || !isNaN(Number(v))) {
              chartCandidates[`${path}.${k}`] = {
                seriesPath: path,
                valuePath: k,
              };
            }
          });
        }
      }

      // Continue traversal
      Object.entries(value).forEach(([k, v]) => {
        const newPath = path ? `${path}.${k}` : k;
        walk(v, newPath);
      });
    }
  }

  walk(json);

  return {
    scalarFields,
    rowCandidates,
    chartCandidates,
  };
}
