/**
 * fetchApi
 *
 * Client-side API helper that routes all external API requests
 * through a server-side proxy.
 *
 * Responsibilities:
 * - Prevent direct client-side calls to third-party APIs
 * - Avoid CORS issues by delegating requests to a backend endpoint
 * - Safely transmit API credentials without exposing them in the browser
 * - Normalize error handling for API failures
 *
 * The proxy endpoint is responsible for performing the actual fetch
 * and returning the response payload.
 */
export async function fetchApi(
  url,
  apiKey = null,
  apiKeyHeader = "X-Api-Key",
  apiKeyPrefix = ""
) {
  const res = await fetch("/api/proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      apiKey,
      apiKeyHeader,
      apiKeyPrefix,
    }),
  });

  /**
   * Handle non-success responses returned by the proxy.
   * The proxy is expected to return a structured error payload.
   */
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error || `Request failed with status ${res.status}`
    );
  }

  /**
   * Successful response payload from the proxied API.
   */
  return res.json();
}
