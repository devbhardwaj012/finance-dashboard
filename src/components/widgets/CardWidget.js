"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api/fetchApi";

export default function CardWidget({
  widget,
  dragListeners,
  onDelete,
  onEdit, // ⚙️ settings handler (already wired in page.js)
}) {
  const { name, url, interval, fields } = widget;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     🔁 Fetch API data
     =============================== */
  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const json = await fetchApi(url);
      setData(json);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     ⏱ Auto-refresh using interval
     =============================== */
  useEffect(() => {
    loadData(); // initial fetch

    if (!interval || interval <= 0) return;

    const id = setInterval(loadData, interval * 1000);
    return () => clearInterval(id);
  }, [url, interval]);

  /* ===============================
     🧠 Read nested field safely
     =============================== */
  function readField(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  return (
    <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">

      {/* ===============================
         Header
         =============================== */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {name}
          </h3>

          {/* Refresh interval badge */}
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
            {interval}s
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Drag */}
          <button
            {...dragListeners}
            className="cursor-grab text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            title="Drag"
          >
            ⠿
          </button>

          {/* Settings */}
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
      <div className="space-y-2">
        {loading && (
          <div className="text-sm text-slate-400">Refreshing…</div>
        )}

        {error && (
          <div className="text-sm text-red-500">{error}</div>
        )}

        {!data && !error && !loading && (
          <div className="text-sm text-slate-400">Loading…</div>
        )}

        {data &&
          fields.map((field) => {
            const value = readField(data, field);
            return (
              <div
                key={field}
                className="flex justify-between gap-3 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="truncate">{field}</span>
                <span className="font-medium">
                  {value ?? "—"}
                </span>
              </div>
            );
          })}
      </div>

      {/* ===============================
         Footer
         =============================== */}
      {lastUpdated && (
        <div className="mt-4 text-xs text-slate-400 text-right">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
