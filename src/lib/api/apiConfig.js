// Your version (correct):
export function getHeadersForApi(url) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (url.includes("indianapi.in")) {
    headers["X-Api-Key"] = process.env.NEXT_PUBLIC_INDIAN_API_KEY || "";
  }

  return headers;
}