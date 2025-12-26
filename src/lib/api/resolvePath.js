export function resolvePath(obj, path) {
  try {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  } catch {
    return undefined;
  }
}
