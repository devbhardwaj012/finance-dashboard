export async function fetchApi(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("API request failed");
  }
  return res.json();
}
