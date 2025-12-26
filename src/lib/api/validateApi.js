// import { getHeadersForApi } from "./apiConfig";

// /**
//  * validateApi
//  *
//  * Returns STRUCTURED data:
//  * - scalars → for cards
//  * - arrays  → for tables
//  * - series  → for charts (time-series)
//  */
// export async function validateApi(url) {
//   try {
//     const headers = getHeadersForApi(url);
//     const res = await fetch(url, { headers });

//     if (!res.ok) {
//       throw new Error(`HTTP ${res.status}`);
//     }

//     const json = await res.json();

//     const scalars = {};
//     const arrays = {};
//     const series = {};

//     function isTimeSeriesObject(obj) {
//       const keys = Object.keys(obj);
//       if (!keys.length) return false;

//       // Alpha Vantage uses YYYY-MM-DD as keys
//       return keys.every((k) => /^\d{4}-\d{2}-\d{2}$/.test(k));
//     }

//     function walk(node, path = "") {
//       if (node === null || node === undefined) return;

//       /* ===============================
//          ARRAY → TABLE CANDIDATE
//          =============================== */
//       if (Array.isArray(node)) {
//         if (node.length && typeof node[0] === "object") {
//           arrays[path] = node;
//         }
//         return; // IMPORTANT: do not recurse into arrays
//       }

//       /* ===============================
//          OBJECT
//          =============================== */
//       if (typeof node === "object") {
//         // Detect time series object
//         if (isTimeSeriesObject(node)) {
//           series[path] = node;
//           return; // IMPORTANT: stop here
//         }

//         Object.entries(node).forEach(([key, value]) => {
//           const nextPath = path ? `${path}.${key}` : key;
//           walk(value, nextPath);
//         });
//         return;
//       }

//       /* ===============================
//          PRIMITIVE → SCALAR
//          =============================== */
//       scalars[path] = node;
//     }

//     walk(json);

//     return {
//       ok: true,
//       raw: json,
//       scalars,
//       arrays,
//       series,
//     };
//   } catch (err) {
//     return {
//       ok: false,
//       error: err?.message || "Failed to connect",
//     };
//   }
// }



















// import { getHeadersForApi } from "./apiConfig";

// /**
//  * validateApi
//  *
//  * Returns STRUCTURED data:
//  * - scalars → for cards
//  * - arrays  → for tables
//  * - series  → for charts (time-series)
//  */
// export async function validateApi(url) {
//   try {
//     const headers = getHeadersForApi(url);
//     const res = await fetch(url, { headers });

//     if (!res.ok) {
//       throw new Error(`HTTP ${res.status}`);
//     }

//     const json = await res.json();

//     const scalars = {};
//     const arrays = {};
//     const series = {};

//     function isTimeSeriesObject(obj) {
//       const keys = Object.keys(obj);
//       if (!keys.length) return false;
//       return keys.every((k) => /^\d{4}-\d{2}-\d{2}$/.test(k));
//     }

//     function walk(node, path = "") {
//       if (node === null || node === undefined) return;

//       /* ===============================
//          ARRAY
//          =============================== */
//       if (Array.isArray(node)) {
//         if (node.length && typeof node[0] === "object") {
//           arrays[path] = node;
//         }

//         // ✅ IMPORTANT: still recurse into array items
//         node.forEach((item, idx) => {
//           walk(item, `${path}.${idx}`);
//         });
//         return;
//       }

//       /* ===============================
//          OBJECT
//          =============================== */
//       if (typeof node === "object") {
//         // Detect time series
//         if (isTimeSeriesObject(node)) {
//           series[path] = node;
//           return; // stop here intentionally
//         }

//         Object.entries(node).forEach(([key, value]) => {
//           const nextPath = path ? `${path}.${key}` : key;
//           walk(value, nextPath);
//         });
//         return;
//       }

//       /* ===============================
//          PRIMITIVE → SCALAR
//          =============================== */
//       scalars[path] = node;
//     }

//     walk(json);

//     return {
//       ok: true,
//       raw: json,
//       scalars,
//       arrays,
//       series,
//     };
//   } catch (err) {
//     return {
//       ok: false,
//       error: err?.message || "Failed to connect",
//     };
//   }
// }










import { getHeadersForApi } from "./apiConfig";

/**
 * validateApi
 *
 * Returns STRUCTURED data:
 * - scalars → for cards
 * - arrays  → for tables
 * - series  → for charts (time-series)
 * - totalFields → single count (UI-friendly)
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

    function isTimeSeriesObject(obj) {
      const keys = Object.keys(obj);
      if (!keys.length) return false;
      return keys.every((k) => /^\d{4}-\d{2}-\d{2}$/.test(k));
    }

    function walk(node, path = "") {
      if (node === null || node === undefined) return;

      /* ===============================
         ARRAY → table source
         =============================== */
      if (Array.isArray(node)) {
        if (node.length && typeof node[0] === "object") {
          arrays[path] = node;
        }

        // ✅ recurse into array items so scalars are not lost
        node.forEach((item, idx) => {
          walk(item, path ? `${path}.${idx}` : String(idx));
        });
        return;
      }

      /* ===============================
         OBJECT
         =============================== */
      if (typeof node === "object") {
        // Time-series detection (Alpha Vantage style)
        if (isTimeSeriesObject(node)) {
          series[path] = node;
          return; // stop here intentionally
        }

        Object.entries(node).forEach(([key, value]) => {
          const nextPath = path ? `${path}.${key}` : key;
          walk(value, nextPath);
        });
        return;
      }

      /* ===============================
         PRIMITIVE → scalar
         =============================== */
      scalars[path] = node;
    }

    walk(json);

    const totalFields =
      Object.keys(scalars).length +
      Object.keys(arrays).length +
      Object.keys(series).length;

    return {
      ok: true,
      raw: json,
      scalars,
      arrays,
      series,
      totalFields, // ✅ RESTORED
    };
  } catch (err) {
    return {
      ok: false,
      error: err?.message || "Failed to connect",
    };
  }
}
