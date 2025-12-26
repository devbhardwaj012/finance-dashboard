// src/lib/api/analyzeApiResponse.js

function getType(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

export function analyzeApiResponse(json) {
  const scalarFields = [];
  const arrayFields = {};

  function walk(obj, path = "") {
    if (obj === null || obj === undefined) return;

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === "object") {
        arrayFields[path + "[]"] = [];

        Object.keys(obj[0]).forEach((key) => {
          arrayFields[path + "[]"].push({
            label: key,
            path: `${path}[].${key}`,
            type: getType(obj[0][key]),
            source: "array",
            arrayPath: path + "[]",
          });
        });
      }
      return;
    }

    if (typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        const nextPath = path ? `${path}.${key}` : key;
        const value = obj[key];

        if (Array.isArray(value)) {
          walk(value, nextPath);
        } else if (typeof value === "object" && value !== null) {
          walk(value, nextPath);
        } else {
          scalarFields.push({
            label: nextPath,
            path: nextPath,
            type: getType(value),
            source: "scalar",
          });
        }
      });
    }
  }

  walk(json);

  return {
    scalar: scalarFields,
    arrays: arrayFields,
  };
}
