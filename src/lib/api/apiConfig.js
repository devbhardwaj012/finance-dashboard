// // Your version (correct):
// export function getHeadersForApi(url) {
//   const headers = {
//     "Content-Type": "application/json",
//   };

//   if (url.includes("indianapi.in")) {
//     headers["X-Api-Key"] = process.env.NEXT_PUBLIC_INDIAN_API_KEY || "";
//   }

//   return headers;
// }






// Your version (correct):
export function getHeadersForApi(url, apiKey = null, apiKeyHeader = "X-Api-Key", apiKeyPrefix = "") {
  const headers = {
    "Content-Type": "application/json",
  };

  // Priority 1: Use API key if provided and not empty
  if (apiKey && apiKey.trim() !== "") {
    const keyValue = apiKeyPrefix && apiKeyPrefix.trim() 
      ? `${apiKeyPrefix.trim()} ${apiKey.trim()}`
      : apiKey.trim();
    headers[apiKeyHeader] = keyValue;
  }
  // Priority 2: Fallback to env for known APIs only if no key provided
  else if (url.includes("indianapi.in") && process.env.NEXT_PUBLIC_INDIAN_API_KEY) {
    headers["X-Api-Key"] = process.env.NEXT_PUBLIC_INDIAN_API_KEY;
  }

  return headers;
}