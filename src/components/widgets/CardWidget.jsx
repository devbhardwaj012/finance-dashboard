"use client";

import { useEffect, useState, useRef } from "react";
import { fetchApi } from "@/lib/api/fetchApi";
import { readPath } from "@/lib/api/validateApi";

/**
 * CardWidget
 *
 * Displays scalar values from an API response in a card layout.
 * Responsibilities:
 * - Lazy load when widget enters viewport
 * - Periodically fetch API data
 * - Extract configured scalar fields using dot-path notation
 * - Format and display values intelligently (numbers, percentages, booleans)
 * - Provide edit and delete controls
 * - Support drag-and-drop interactions
 */
export default function CardWidget({ widget, dragListeners, onDelete, onEdit }) {
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
    cardFields = [],
  } = widget;

  /**
   * Data and UI state
   */
  const [rawData, setRawData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const containerRef = useRef(null);

  /**
   * Fetches data from the API and updates widget state.
   * This function is reused for both initial load and interval refresh.
   */
  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const json = await fetchApi(
        url,
        apiKey,
        apiKeyHeader,
        apiKeyPrefix
      );

      setRawData(json);
      setLastUpdated(new Date());
      setIsInitialLoad(false);
      setHasLoaded(true);
    } catch (err) {
      setError(err?.message || "Failed to refresh data");
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
   * Automatically cleans up the interval on unmount or config change.
   */
  useEffect(() => {
    if (!hasLoaded || !interval || interval <= 0) return;

    const id = setInterval(loadData, interval * 1000);
    return () => clearInterval(id);
  }, [hasLoaded, url, interval]);

  /**
   * Formats values for display based on:
   * - Type (number, string, boolean, object)
   * - Field semantics (percentage detection)
   * - Value sign (positive/negative coloring)
   */
  function renderValue(value, fieldPath) {
    if (value == null) return "—";

    const hasPercentSymbol =
      typeof value === "string" && value.includes("%");

    const numValue = parseFloat(value);

    if (!isNaN(numValue) && typeof value === "string" && !isNaN(value)) {
      const isPercentageField =
        hasPercentSymbol ||
        (fieldPath &&
          (fieldPath.includes("percentChange") ||
            fieldPath.includes("PercentChange") ||
            fieldPath.toLowerCase().includes("percent") ||
            fieldPath.includes("%")));

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
        fieldPath &&
        (fieldPath.includes("percentChange") ||
          fieldPath.includes("PercentChange") ||
          fieldPath.toLowerCase().includes("percent") ||
          fieldPath.includes("%"));

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

    if (typeof value === "boolean") {
      return value ? "✓ Yes" : "✗ No";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  }

  /**
   * Skeleton placeholder during the very first load.
   * Prevents layout shift and provides visual feedback.
   */
  if (isInitialLoad && !rawData && !error) {
    return (
      <div 
        ref={containerRef} 
        className="relative w-full h-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col min-h-[160px]"
      >
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-3 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
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
    );
  }

  return (
    <div
      ref={containerRef}
      {...dragListeners}
      className="relative w-full h-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing flex flex-col"
    >
      {/* Refresh indicator during background updates */}
      {loading && !isInitialLoad && (
        <div className="absolute top-2 right-2 text-xs bg-emerald-500 text-white px-2 py-1 rounded">
          Updating
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
            className="text-slate-400 hover:text-slate-600 p-1 hover:scale-110 transition"
            title="Edit"
          >
            ⚙️
          </button>

          {/* Delete action */}
          <button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 p-1 hover:scale-110 transition"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {rawData &&
          cardFields.map((fieldPath) => (
            <div
              key={fieldPath}
              className="flex justify-between gap-4 text-sm border-b pb-2 last:border-0"
            >
              <span className="font-medium truncate">
                {fieldPath.replace(/\./g, " → ")}
              </span>
              <span className="text-right break-all">
                {renderValue(readPath(rawData, fieldPath), fieldPath)}
              </span>
            </div>
          ))}
      </div>

      {/* Last refresh timestamp */}
      {lastUpdated && (
        <div className="mt-4 text-xs text-slate-400 text-right">
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}