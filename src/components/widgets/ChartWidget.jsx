"use client";

import { useEffect, useState, useRef } from "react";
import { fetchApi } from "@/lib/api/fetchApi";
import { readPath } from "@/lib/api/validateApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/**
 * ChartWidget
 *
 * Renders a time-series chart based on API data.
 * Responsibilities:
 * - Lazy load when widget enters viewport
 * - Periodically fetch API data
 * - Resolve and validate a configured series path
 * - Normalize data into a chart-compatible format
 * - Render a responsive line chart
 * - Handle error states and misconfiguration
 * - Support drag-and-drop interactions
 */
export default function ChartWidget({
  widget,
  dragListeners,
  onEdit,
  onDelete,
}) {
  const {
    name,
    url,
    apiKey,
    apiKeyHeader,
    apiKeyPrefix,
    interval,
    seriesPath,
    yField,
  } = widget;

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const containerRef = useRef(null);

  async function loadData() {
    if (!seriesPath || !yField) {
      setError("Chart not configured. Click ⚙️ to set up.");
      setIsInitialLoad(false);
      setHasLoaded(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const json = await fetchApi(
        url,
        apiKey,
        apiKeyHeader,
        apiKeyPrefix
      );

      const series = readPath(json, seriesPath);

      if (!series) {
        const errorMsg =
          json.Information || json.Error || json.error || json.message;

        if (errorMsg) {
          throw new Error(`API Error: ${errorMsg}`);
        }

        throw new Error(`Path "${seriesPath}" not found in API response.`);
      }

      let formatted = [];

      if (typeof series === "object" && !Array.isArray(series)) {
        const entries = Object.entries(series);
        const [_, firstValues] = entries[0] || [];

        if (!firstValues || !(yField in firstValues)) {
          throw new Error(`Field "${yField}" not found in series data.`);
        }

        formatted = entries
          .map(([date, values]) => {
            const raw = values?.[yField];
            const num =
              typeof raw === "string" ? parseFloat(raw) : Number(raw);

            if (!Number.isFinite(num)) return null;

            return { date, value: num };
          })
          .filter(Boolean)
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
      } else if (Array.isArray(series)) {
        const firstItem = series[0];

        const dateField =
          firstItem.date ||
          firstItem.time ||
          firstItem.timestamp ||
          Object.keys(firstItem)[0];

        if (!(yField in firstItem)) {
          throw new Error(`Field "${yField}" not found in array items.`);
        }

        formatted = series
          .map((item) => {
            const raw = item[yField];
            const num =
              typeof raw === "string" ? parseFloat(raw) : Number(raw);

            if (!item[dateField] || !Number.isFinite(num)) return null;

            return {
              date: String(item[dateField]),
              value: num,
            };
          })
          .filter(Boolean);
      } else {
        throw new Error("Series data must be an object or array.");
      }

      if (formatted.length === 0) {
        throw new Error("No valid data points found.");
      }

      setData(formatted);
      setLastUpdated(new Date());
      setIsInitialLoad(false);
      setHasLoaded(true);
    } catch (err) {
      setError(err.message || "Failed to load chart");
      setData([]);
      setIsInitialLoad(false);
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Intersection Observer for lazy loading
   */
  useEffect(() => {
    if (hasLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadData();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded]);

  /**
   * Refresh interval setup after initial load.
   */
  useEffect(() => {
    if (!hasLoaded || !interval) return;

    const id = setInterval(loadData, interval * 1000);
    return () => clearInterval(id);
  }, [hasLoaded, url, interval, seriesPath, yField]);

  if (isInitialLoad && data.length === 0 && !error) {
    return (
      <div 
        ref={containerRef} 
        className="relative w-full flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm min-h-[240px] sm:min-h-[300px]"
      >
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Chart skeleton */}
        <div className="flex-1 relative">
          {/* Simulated axes */}
          <div className="absolute left-0 bottom-0 top-0 w-8 border-r border-slate-200 dark:border-slate-700"></div>
          <div className="absolute left-0 right-0 bottom-0 h-8 border-t border-slate-200 dark:border-slate-700"></div>
          
          {/* Simulated line chart */}
          <div className="absolute inset-8 flex items-end justify-around">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75].map((height, i) => (
              <div 
                key={i}
                className="w-2 bg-slate-200 dark:bg-slate-700 rounded-t animate-pulse"
                style={{ 
                  height: `${height}%`,
                  animationDelay: `${i * 100}ms`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Loading indicator */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
          <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      {...dragListeners}
      className="
        relative
        w-full
        flex
        flex-col
        rounded-xl
        border border-slate-200 dark:border-slate-700
        bg-white dark:bg-slate-900
        p-4
        shadow-sm
        hover:shadow-md
        transition-shadow
        cursor-grab
        active:cursor-grabbing
        min-h-[240px] sm:min-h-[300px]
      "
    >
      {loading && !isInitialLoad && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            Updating
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white truncate">
            {name}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
            {interval}s
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={onEdit}
            className="text-slate-400 hover:text-slate-600 p-1 transition-transform"
            title="Edit"
          >
            ⚙️
          </button>

          <button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 p-1 transition-transform"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">
          <div className="font-semibold mb-2">Chart Error</div>
          <div className="text-xs whitespace-pre-wrap font-mono mb-3">
            {error}
          </div>
          <button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={onEdit}
            className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Fix Configuration
          </button>
        </div>
      )}

      {!error && data.length > 0 && (
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
                stroke="#64748b"
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 10 }} stroke="#64748b" width={40} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Last refresh timestamp */}
      {lastUpdated && (
        <div className="mt-4 text-xs text-slate-400 text-right">
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}