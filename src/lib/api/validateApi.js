import { flattenJson } from "./flattenJson";
import { getHeadersForApi } from "./apiConfig";

/**
 * validateApi
 *
 * Returns STRUCTURED data:
 * - scalars → for cards
 * - arrays  → for tables
 * - series  → for charts
 */
export async function validateApi(url) {
  try {
    const headers = getHeadersForApi(url);
    const res = await fetch(url, { headers });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();

    const scalars = {};
    const arrays = {};
    const series = {};

    function walk(node, path = "") {
      if (node == null) return;

      // ARRAY → table candidate
      if (Array.isArray(node)) {
        if (node.length && typeof node[0] === "object") {
          arrays[path] = node;
        }
        node.forEach((v, i) => walk(v, `${path}.${i}`));
        return;
      }

      // OBJECT
      if (typeof node === "object") {
        // Time series detection (Alpha Vantage style)
        if (
          Object.keys(node).length &&
          Object.values(node)[0] &&
          typeof Object.values(node)[0] === "object"
        ) {
          const firstKey = Object.keys(node)[0];
          if (/^\d{4}-\d{2}-\d{2}$/.test(firstKey)) {
            series[path] = node;
          }
        }

        Object.entries(node).forEach(([k, v]) =>
          walk(v, path ? `${path}.${k}` : k)
        );
        return;
      }

      // PRIMITIVE → scalar
      scalars[path] = node;
    }

    walk(json);

    return {
      ok: true,
      raw: json,
      scalars,
      arrays,
      series,
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message || "Failed to connect",
    };
  }
}
