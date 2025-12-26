export function getValueByPath(obj, path) {
  if (!obj || !path) return undefined;

  return path
    .split(".")
    .reduce((acc, key) => {
      if (acc && typeof acc === "object" && key in acc) {
        return acc[key];
      }
      return undefined;
    }, obj);
}
