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
      {/* Widget Name */}
      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Widget Name <span className="text-red-500">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Stock Dashboard"
          className="w-full px-3 py-2 rounded-md border bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* API URL */}
      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          API URL <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/data"
            className="flex-1 px-3 py-2 rounded-md border bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <button
            type="button"
            onClick={handleTest}
            disabled={loading || !url}
            className="px-4 py-2 rounded-md text-white font-medium bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
          >
            {loading ? "Testing..." : "Test API"}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {(localError || apiResult) && (
        <div
          className={`px-4 py-2 rounded-md text-sm ${
            localError || apiResult?.ok === false
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
          }`}
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

      {/* Refresh Interval */}
      <div>
        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
          Refresh Interval (seconds)
        </label>
        <input
          type="number"
          min={5}
          max={3600}
          value={interval}
          onChange={(e) => setInterval(Math.max(5, Number(e.target.value)))}
          className="w-full px-3 py-2 rounded-md border bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <p className="text-xs text-slate-500 mt-1">
          Minimum: 5 seconds, Maximum: 3600 seconds (1 hour)
        </p>
      </div>
    </div>
  );
}