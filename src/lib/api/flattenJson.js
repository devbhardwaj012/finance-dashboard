export function flattenJson(obj, prefix = "", res = {}) {
  for (const key in obj) {
    const val = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "object" && val !== null) {
      flattenJson(val, newKey, res);
    } else {
      res[newKey] = val;
    }
  }
  return res;
}