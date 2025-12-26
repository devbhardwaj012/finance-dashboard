"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api/fetchApi";

/**
 * TableWidget
 * - Uses arrayPath as row source
 * - Uses tableFields as columns
 */
export default function TableWidget({
  widget,
  dragListeners,
  onEdit,
  onDelete,
}) {
  const { name, url, interval, arrayPath, tableFields = [] } = widget;

  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function readPath(obj, path) {
    if (!path) return undefined;
    return path.split(".").reduce((acc, k) => acc?.[k], obj);
  }

  async function loadData() {
    if (!arrayPath || tableFields.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const json = await fetchApi(url);
      const data = readPath(json, arrayPath);

      if (!Array.isArray(data)) {
        throw new Error("Selected table source is not an array");
      }

      setRows(data);
    } catch (err) {
      setError(err.message || "Failed to load table data");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    if (!interval) return;
    const id = setInterval(loadData, interval * 1000);
    return () => clearInterval(id);
  }, [url, interval, arrayPath, tableFields.join("|")]);

  return (
    <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      
      {/* ===============================
         Header (MATCHES CARD)
         =============================== */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {name}
          </h3>

          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
            {interval}s
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Drag */}
          <button
            {...dragListeners}
            className="cursor-grab text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            title="Drag"
          >
            ⠿
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(widget)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            title="Edit widget"
          >
            ⚙️
          </button>

          {/* Delete */}
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-600"
            title="Delete widget"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ===============================
         Body
         =============================== */}
      {loading && <div className="text-sm text-slate-400">Loading…</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {!loading && !error && rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                {tableFields.map((f) => (
                  <th key={f} className="text-left p-2 font-medium">
                    {f}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  {tableFields.map((f) => (
                    <td key={f} className="p-2">
                      {row?.[f] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="text-sm text-slate-400">No rows found</div>
      )}
    </div>
  );
}
