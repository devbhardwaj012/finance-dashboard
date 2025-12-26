"use client";

import { useState } from "react";

export default function ApiTester({
  name,
  setName,
  url,
  setUrl,
  interval,
  setInterval,
  onTest,
  apiResult,
}) {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  async function handleTest() {
    setLocalError(null);

    // 🛑 Basic validation
    if (!url || !url.startsWith("http")) {
      setLocalError("Please enter a valid API URL");
      return;
    }

    try {
      setLoading(true);
      await onTest();
    } catch (err) {
      setLocalError("Unexpected error while testing API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* ===============================
          Widget Name
         =============================== */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Widget Name <span className="text-red-500">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Reliance stock"
          className="
            w-full px-3 py-2 rounded-md
            border bg-white text-slate-900
            dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
          "
        />
      </div>

      {/* ===============================
          API URL
         =============================== */}
      <div>
        <label className="block text-sm font-medium mb-1">
          API URL <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://stock.indianapi.in/ipo"
            className="
              flex-1 px-3 py-2 rounded-md
              border bg-white text-slate-900
              dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
            "
          />
          <button
            type="button"
            onClick={handleTest}
            disabled={loading}
            className={`
              px-4 py-2 rounded-md text-white font-medium
              ${loading ? "bg-slate-400" : "bg-emerald-500 hover:bg-emerald-400"}
            `}
          >
            {loading ? "Testing..." : "Test API"}
          </button>
        </div>
      </div>

      {/* ===============================
          Errors / Result
         =============================== */}
      {(localError || apiResult) && (
        <div
          className={`
            px-4 py-2 rounded-md text-sm
            ${
              localError || apiResult?.ok === false
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
            }
          `}
        >
          {localError && <>✕ {localError}</>}

          {!localError && apiResult?.ok && (
            <>
              ✓ API connected successfully.{" "}
              <strong>{apiResult.totalFields}</strong> fields detected.
            </>
          )}

          {!localError && apiResult?.ok === false && (
            <>✕ {apiResult.error?.message || "API test failed"}</>
          )}
        </div>
      )}

      {/* ===============================
          Refresh Interval
         =============================== */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Refresh Interval (seconds)
        </label>
        <input
          type="number"
          min={5}
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
          className="
            w-full px-3 py-2 rounded-md
            border bg-white text-slate-900
            dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
          "
        />
        <p className="text-xs text-slate-500 mt-1">
          Minimum recommended: 5 seconds
        </p>
      </div>
    </div>
  );
}
