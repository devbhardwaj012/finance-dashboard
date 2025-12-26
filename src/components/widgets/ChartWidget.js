"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api/fetchApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * ChartWidget
 * - Time series chart
 * - X = date
 * - Y = selected numeric field
 */
export default function ChartWidget({
  widget,
  dragListeners,
  onEdit,
  onDelete,
}) {
  const { name, url, interval, seriesPath, yField } = widget;

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  function readPath(obj, path) {
    if (!path) return undefined;
    return path.split(".").reduce((acc, k) => acc?.[k], obj);
  }

  async function loadData() {
    if (!seriesPath || !yField) return;

    try {
      setError(null);

      const json = await fetchApi(url);
      const series = readPath(json, seriesPath);

      if (!series || typeof series !== "object") {
        throw new Error("Invalid series path");
      }

      const formatted = Object.entries(series)
        .map(([date, values]) => ({
          date,
          value: Number(values?.[yField]),
        }))
        .filter((d) => Number.isFinite(d.value))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setData(formatted);
    } catch (err) {
      setError(err.message || "Failed to load chart");
      setData([]);
    }
  }

  useEffect(() => {
    loadData();

    if (!interval) return;
    const id = setInterval(loadData, interval * 1000);
    return () => clearInterval(id);
  }, [url, interval, seriesPath, yField]);

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
      {error && <div className="text-sm text-red-500">{error}</div>}

      {!error && data.length === 0 && (
        <div className="text-sm text-slate-400">No chart data</div>
      )}

      {!error && data.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
