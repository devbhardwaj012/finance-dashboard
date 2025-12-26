"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api/fetchApi";
import { flattenJson } from "@/lib/api/flattenJson";

export default function CardWidget({
  widget,
  dragListeners,
  onDelete,
  onEdit,
}) {
  const {
    name,
    url,
    interval,
    cardFields = [],   // ✅ correct source
    fields = [],       // ✅ backward compatibility
  } = widget;

  // Prefer cardFields, fallback to fields
  const resolvedFields = cardFields.length > 0 ? cardFields : fields;

  const [rawData, setRawData] = useState(null);
  const [flatData, setFlatData] = useState({});
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     🔁 Fetch + flatten API data
     =============================== */
  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const json = await fetchApi(url);
      const flattened = flattenJson(json);

      setRawData(json);
      setFlatData(flattened);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.message || "Failed to refresh data");
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     ⏱ Auto-refresh
     =============================== */
  useEffect(() => {
    loadData();

    if (!interval || interval <= 0) return;
    const id = setInterval(loadData, interval * 1000);
    return () => clearInterval(id);
  }, [url, interval]);

  /* ===============================
     🧠 Render value safely
     =============================== */
  function renderValue(value) {
    if (value == null) return "—";

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    return (
      <pre className="text-xs whitespace-pre-wrap break-all opacity-80 text-right">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
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

          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
            {interval}s
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            {...dragListeners}
            className="cursor-grab text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            title="Drag"
          >
            ⠿
          </button>

          <button
            onClick={() => onEdit(widget)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            title="Edit widget"
          >
            ⚙️
          </button>

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

        {!rawData && !error && !loading && (
          <div className="text-sm text-slate-400">Loading…</div>
        )}

        {rawData && resolvedFields.length === 0 && (
          <div className="text-sm text-slate-400">
            No fields selected
          </div>
        )}

        {rawData &&
          resolvedFields.map((fieldPath) => {
            const value = flatData[fieldPath];

            return (
              <div
                key={fieldPath}
                className="
                  flex justify-between gap-4
                  text-sm text-slate-700 dark:text-slate-300
                  border-b border-slate-100 dark:border-slate-800 pb-1
                "
              >
                <span className="truncate max-w-[55%]">
                  {fieldPath.replace(/\./g, " → ")}
                </span>

                <span className="font-medium max-w-[45%] text-right">
                  {renderValue(value)}
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
