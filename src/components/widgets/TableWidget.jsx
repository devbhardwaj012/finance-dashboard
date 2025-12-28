"use client";

import { useEffect, useState, useRef } from "react";
import { fetchApi } from "@/lib/api/fetchApi";
import { readPath } from "@/lib/api/validateApi";

import ResizableWidget from "./ResizableWidget";

/**
 * TableWidget
 *
 * Renders tabular data from an API response.
 * Responsibilities:
 * - Lazy load when widget enters viewport
 * - Periodically fetch API data
 * - Extract an array from the response using a configured path
 * - Render selected fields as table columns
 * - Support pagination for large datasets
 * - Handle loading, error, and empty states
 * - Support drag-and-drop and resize interactions
 */
export default function TableWidget({
  widget,
  dragListeners,
  onEdit,
  onDelete,
}) {
  /**
   * Widget configuration
   */
  const {
    name,
    url,
    apiKey,
    apiKeyHeader,
    apiKeyPrefix,
    interval,
    arrayPath,
    tableFields = [],
  } = widget;

  /**
   * Pagination configuration
   */
  const ROWS_PER_PAGE = 10;

  /**
   * Table state
   */
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const containerRef = useRef(null);

  /**
   * Fetches API data and extracts table rows using the configured array path.
   */
  async function loadData() {
    if (!arrayPath || tableFields.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const json = await fetchApi(
        url,
        apiKey,
        apiKeyHeader,
        apiKeyPrefix
      );

      const data = readPath(json, arrayPath);

      if (!Array.isArray(data)) {
        throw new Error("Selected source is not an array");
      }

      setRows(data);
      setLastUpdated(new Date());
      setPage(0);
      setIsInitialLoad(false);
      setHasLoaded(true);
    } catch (err) {
      setError(err.message || "Failed to load table");
      setRows([]);
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
   * Automatically refreshes data based on widget configuration.
   */
  useEffect(() => {
    if (!hasLoaded || !interval) return;

    const id = setInterval(loadData, interval * 1000);
    return () => clearInterval(id);
  }, [hasLoaded, url, interval, arrayPath, tableFields.join("|")]);

  /**
   * Derived pagination values
   */
  const totalPages = Math.ceil(rows.length / ROWS_PER_PAGE);
  const displayRows = rows.slice(
    page * ROWS_PER_PAGE,
    (page + 1) * ROWS_PER_PAGE
  );

  /**
   * Formats individual cell values for display.
   * Handles numbers, percentages, booleans, strings, and objects.
   */
  function renderCellValue(value, fieldName) {
    if (value == null) return "—";

    const hasPercentSymbol =
      typeof value === "string" && value.includes("%");

    const numValue = parseFloat(value);

    if (!isNaN(numValue) && typeof value === "string" && !isNaN(value)) {
      const isPercentageField =
        hasPercentSymbol ||
        (fieldName &&
          (fieldName.includes("percentChange") ||
            fieldName.includes("PercentChange") ||
            fieldName.toLowerCase().includes("percent") ||
            fieldName.includes("%")));

      if (isPercentageField) {
        return (
          <span
            className={
              numValue >= 0
                ? "text-green-600 font-medium"
                : "text-red-600 font-medium"
            }
          >
            {numValue.toLocaleString()}%
          </span>
        );
      }

      return numValue.toLocaleString();
    }

    if (hasPercentSymbol) {
      const cleanValue = value.replace("%", "").trim();
      const numVal = parseFloat(cleanValue);

      if (!isNaN(numVal)) {
        return (
          <span
            className={
              numVal >= 0
                ? "text-green-600 font-medium"
                : "text-red-600 font-medium"
            }
          >
            {value}
          </span>
        );
      }
    }

    if (typeof value === "number") {
      const isPercentageField =
        fieldName &&
        (fieldName.includes("percentChange") ||
          fieldName.includes("PercentChange") ||
          fieldName.toLowerCase().includes("percent") ||
          fieldName.includes("%"));

      if (isPercentageField) {
        return (
          <span
            className={
              value >= 0
                ? "text-green-600 font-medium"
                : "text-red-600 font-medium"
            }
          >
            {value.toLocaleString()}%
          </span>
        );
      }

      return value.toLocaleString();
    }

    if (typeof value === "string" || typeof value === "boolean") {
      return String(value);
    }

    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return "[Complex Object]";
      }
    }

    return String(value);
  }

  /**
   * Skeleton loader shown during the initial fetch.
   */
  if (isInitialLoad && rows.length === 0 && !error) {
    return (
      <ResizableWidget>
        <div 
          ref={containerRef} 
          className="relative w-full h-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col min-h-[300px]"
        >
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Table skeleton */}
          <div className="flex-1 space-y-2">
            {/* Header row */}
            <div className="flex gap-4 pb-2 border-b-2 border-slate-200 dark:border-slate-700">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 flex-1 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              ))}
            </div>

            {/* Data rows */}
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <div key={row} className="flex gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
                {[1, 2, 3, 4].map((col) => (
                  <div 
                    key={col} 
                    className="h-4 flex-1 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
                    style={{ animationDelay: `${(row * 4 + col) * 50}ms` }}
                  ></div>
                ))}
              </div>
            ))}
          </div>

          {/* Loading indicator */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </ResizableWidget>
    );
  }

  return (
    <ResizableWidget>
      <div
        ref={containerRef}
        {...dragListeners}
        className="relative w-full h-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing flex flex-col"
      >
        {/* Background refresh indicator */}
        {loading && !isInitialLoad && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              Updating
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {name}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
              {interval}s
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit action */}
            <button
              onPointerDownCapture={(e) => e.stopPropagation()}
              onClick={onEdit}
              className="text-slate-400 hover:text-slate-600 p-1 hover:scale-110 transition-transform"
              title="Edit"
            >
              ⚙️
            </button>

            {/* Delete action */}
            <button
              onPointerDownCapture={(e) => e.stopPropagation()}
              onClick={onDelete}
              className="text-red-500 hover:text-red-600 p-1 hover:scale-110 transition-transform"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {error}
          </div>
        )}

        {/* Table */}
        {!error && rows.length > 0 && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-900">
                  <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                    {tableFields.map((f) => (
                      <th
                        key={f}
                        className="text-left p-2 font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {f}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      {tableFields.map((f) => (
                        <td
                          key={f}
                          className="p-2 text-slate-600 dark:text-slate-400"
                        >
                          {renderCellValue(row?.[f], f)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex-shrink-0">
                <span>
                  Page {page + 1} of {totalPages} • {rows.length} rows
                </span>
                <div className="flex gap-2">
                  <button
                    onPointerDownCapture={(e) => e.stopPropagation()}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    ← Prev
                  </button>
                  <button
                    onPointerDownCapture={(e) => e.stopPropagation()}
                    onClick={() =>
                      setPage((p) =>
                        Math.min(totalPages - 1, p + 1)
                      )
                    }
                    disabled={page >= totalPages - 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Last refresh timestamp */}
            {lastUpdated && (
              <div className="mt-2 text-xs text-slate-400 text-right">
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && rows.length === 0 && (
          <div className="text-sm text-slate-400 text-center py-4">
            No rows found. Click ⚙️ to reconfigure.
          </div>
        )}
      </div>
    </ResizableWidget>
  );
}