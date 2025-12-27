"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, setTheme } from "@/lib/store/slices/themeSlice";
import { useEffect, useState } from "react";

import {
  exportDashboardConfig,
  importDashboardConfig,
} from "@/lib/utils/dashboardConfig";
import { replaceDashboard } from "@/lib/store/slices/widgetSlice";

export default function Navbar({ onAddWidget }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const widgets = useSelector((state) => state.widgets);

  const [mounted, setMounted] = useState(false);

  const widgetCount = widgets.length;

  // ✅ EXPORT HANDLER (inside component)
  function handleExport() {
    exportDashboardConfig({ widgets, theme });
  }

  // ✅ IMPORT HANDLER (inside component)
  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const dashboard = await importDashboardConfig(file);
      dispatch(replaceDashboard({ widgets: dashboard.widgets }));
    } catch (err) {
      alert(err.message);
    }
  }

  // Theme init
  useEffect(() => {
    setMounted(true);

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      dispatch(setTheme(storedTheme));
    }

    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Theme sync
  useEffect(() => {
    if (!mounted) return;

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme, mounted]);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📊</div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Finance Dashboard
            </h1>
            {mounted && widgetCount > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {widgetCount} {widgetCount === 1 ? "widget" : "widgets"} live
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mounted ? (theme === "dark" ? "🌞" : "🌙") : "🌙"}
          </button>

          <button className="cursor-pointer p-2 border border-gray-400 rounded-md" onClick={handleExport}>Export Dashboard</button>

          <label className="cursor-pointer p-2 border border-gray-400 rounded-md">
            Import Dashboard
            <input
              type="file"
              accept="application/json"
              hidden
              onChange={handleImport}
            />
          </label>

          <button
            onClick={onAddWidget}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
          >
            + Add Widget
          </button>
        </div>
      </div>
    </nav>
  );
}