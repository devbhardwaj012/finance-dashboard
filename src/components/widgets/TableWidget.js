"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api/fetchApi";

/**
 * TableWidget
 * - Renders array-based data
 * - Uses arrayPath as row source
 * - Uses fields as columns
 */
export default function TableWidget({ widget }) {
  const { name, url, interval, arrayPath, fields } = widget;

  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /** -------------------------------
   * Read nested path safely
   */
  function readPath(obj, path) {
    return path.split(".").reduce((acc, k) => acc?.[k], obj);
  }

  /** -------------------------------
   * Fetch & resolve table rows
   */
  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const json = await fetchApi(url);
      const data = readPath(json, arrayPath);

      if (!Array.isArray(data)) {
        throw new Error("Selected path is not an array");
      }

      setRows(data);
    } catch (err) {
      setError(err.message || "Failed to load table data");
    } finally {
      setLoading(false);
    }
  }

  /** -------------------------------
   * Auto refresh
   */
  useEffect(() => {
    loadData();
    if (!interval) return;
    const id = setInterval(loadData, interval * 1000);
    return () => clearInterval(id);
  }, [url, interval, arrayPath]);

  return (
    <div className="rounded-xl border bg-white dark:bg-slate-900 p-4 shadow-sm">
      <h3 className="font-semibold mb-3">{name}</h3>

      {loading && <div className="text-sm text-slate-400">Loading…</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                {fields.map((f) => (
                  <th key={f} className="text-left p-2 font-medium">
                    {f}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  {fields.map((f) => (
                    <td key={f} className="p-2">
                      {row?.[f] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="text-sm text-slate-400 mt-3">
              No rows found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
