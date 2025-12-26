import { flattenJson } from "./flattenJson";
import { getHeadersForApi } from "./apiConfig";

/**
 * Validates any API endpoint.
 * - Adds headers automatically (Indian API, Alpha Vantage, etc.)
 * - Fetches JSON
 * - Flattens deeply
 * - Returns a normalized contract for the UI
 */
export async function validateApi(url) {
  try {
    const headers = getHeadersForApi(url);

    const res = await fetch(url, { headers });

    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false,
        error: {
          type: "HTTP_ERROR",
          message: `HTTP ${res.status}: ${text || res.statusText}`,
        },
      };
    }

    const json = await res.json();

    // 🔥 THIS IS THE KEY STEP
    const flattened = flattenJson(json);

    return {
      ok: true,
      raw: json,                         // original response
      flattened,                         // flattened map
      totalFields: Object.keys(flattened).length,
    };
  } catch (err) {
    return {
      ok: false,
      error: {
        type: "NETWORK_ERROR",
        message: err.message || "Failed to connect to API",
      },
    };
  }
}
