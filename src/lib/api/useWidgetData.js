"use client";

import { useEffect, useState } from "react";

export function useWidgetData(url, interval) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch API");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();

    const id = setInterval(fetchData, interval * 1000);
    return () => clearInterval(id);
  }, [url, interval]);

  return { data, error, loading };
}
