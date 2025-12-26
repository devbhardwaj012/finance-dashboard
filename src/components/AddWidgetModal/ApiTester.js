"use client";

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
  return (
    <div className="space-y-4">
      {/* ===============================
          Widget Name
         =============================== */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Widget Name <span className="text-red-500">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Bitcoin price"
          className="
            w-full px-3 py-2 rounded-md
            bg-white text-slate-900 border border-slate-300
            dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
            focus:outline-none focus:ring-2 focus:ring-emerald-500
          "
        />
      </div>

      {/* ===============================
          API URL
         =============================== */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          API URL <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="
              flex-1 px-3 py-2 rounded-md
              bg-white text-slate-900 border border-slate-300
              dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
              focus:outline-none focus:ring-2 focus:ring-emerald-500
            "
          />
          <button
            type="button"
            onClick={onTest}
            className="
              px-4 py-2 rounded-md
              bg-emerald-500 hover:bg-emerald-400
              text-white font-medium
            "
          >
            Test API
          </button>
        </div>
      </div>

      {/* ===============================
          API Result (Success / Error)
         =============================== */}
      {apiResult && (
        <div
          className={`
            flex items-start gap-2 px-4 py-2 rounded-md text-sm border
            ${
              apiResult.ok
                ? `
                  bg-emerald-50 text-emerald-700 border-emerald-200
                  dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800
                `
                : `
                  bg-red-50 text-red-700 border-red-200
                  dark:bg-red-900/30 dark:text-red-300 dark:border-red-800
                `
            }
          `}
        >
          {apiResult.ok ? (
            <>
              <span>✓</span>
              <span>
                API connection successful!{" "}
                <strong>{apiResult.fields.length}</strong> fields found.
              </span>
            </>
          ) : (
            <>
              <span>✕</span>
              <span>
                <strong>{apiResult.error.type}:</strong>{" "}
                {apiResult.error.message}
              </span>
            </>
          )}
        </div>
      )}

      {/* ===============================
          Refresh Interval
         =============================== */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Refresh Interval (seconds)
        </label>
        <input
          type="number"
          min={5}
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
          className="
            w-full px-3 py-2 rounded-md
            bg-white text-slate-900 border border-slate-300
            dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
            focus:outline-none focus:ring-2 focus:ring-emerald-500
          "
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Minimum recommended: 5 seconds
        </p>
      </div>
    </div>
  );
}
