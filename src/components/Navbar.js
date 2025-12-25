"use client";

import ThemeToggle from "./ThemeToggle";

export default function Navbar({ onAddWidget }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
          Finance Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Connect to APIs and build your custom dashboard
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          onClick={onAddWidget}
          className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
        >
          + Add Widget
        </button>
      </div>
    </header>
  );
}
