// Your version (correct):
import { getHeadersForApi } from "./apiConfig";

export async function fetchApi(url, apiKey = null, apiKeyHeader = "X-Api-Key", apiKeyPrefix = "") {
  const headers = getHeadersForApi(url, apiKey, apiKeyHeader, apiKeyPrefix);
  const res = await fetch(url, { headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text || res.statusText}`);
  }

  return res.json();
}