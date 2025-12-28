"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toggleTheme, setTheme } from "@/lib/store/slices/themeSlice";
import { replaceDashboard } from "@/lib/store/slices/widgetSlice";

import {
  exportDashboardConfig,
  importDashboardConfig,
} from "@/lib/utils/dashboardConfig";

/**
 * Navbar
 *
 * Top-level navigation bar for the dashboard.
 * Responsibilities:
 * - Theme toggle (light / dark)
 * - Dashboard import and export
 * - Widget count display
 * - Entry point for adding new widgets
 * - Responsive behavior for desktop and mobile
 */
export default function Navbar({ onAddWidget }) {
  const dispatch = useDispatch();

  /**
   * Global state selectors
   */
  const theme = useSelector((state) => state.theme.mode);
  const widgets = useSelector((state) => state.widgets);

  /**
   * Local UI state
   */
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Derived values
   */
  const widgetCount = widgets.length;

  /**
   * Exports the current dashboard configuration
   * including widgets and theme.
   */
  function handleExport() {
    exportDashboardConfig({ widgets, theme });
    setMenuOpen(false);
  }

  /**
   * Imports a dashboard configuration from a JSON file.
   * Replaces widgets and applies theme if provided.
   */
  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const dashboard = await importDashboardConfig(file);

      // Replace widgets in the store
      dispatch(replaceDashboard({ widgets: dashboard.widgets }));

      // Apply imported theme if present
      if (dashboard.theme) {
        dispatch(setTheme(dashboard.theme));
      }

      setMenuOpen(false);
    } catch (err) {
      alert(err.message);
    }
  }

  /**
   * Initial theme setup on first client render.
   * Reads persisted theme from localStorage and
   * applies the correct HTML class.
   */
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

  /**
   * Synchronizes theme changes with:
   * - document root class
   * - localStorage persistence
   */
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
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left section: Logo and title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            <div className="text-xl sm:text-2xl flex-shrink-0">📊</div>

            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate">
                Finance Dashboard
              </h1>

              {mounted && widgetCount > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  {widgetCount} {widgetCount === 1 ? "widget" : "widgets"} live
                </p>
              )}
            </div>
          </div>

          {/* Right section: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
            {/* Mobile-only widget count indicator */}
            {mounted && widgetCount > 0 && (
              <div className="flex sm:hidden items-center justify-center w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg relative">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {widgetCount}
                </span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
            )}

            {/* Theme toggle button */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-lg sm:text-xl"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              suppressHydrationWarning
              aria-label="Toggle theme"
            >
              {mounted ? (theme === "dark" ? "🌞" : "🌙") : "🌙"}
            </button>

            {/* Desktop-only import/export actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleExport}
                className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
              >
                Export
              </button>

              <label className="cursor-pointer px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300">
                Import
                <input
                  type="file"
                  accept="application/json"
                  hidden
                  onChange={handleImport}
                />
              </label>
            </div>

            {/* Add widget button */}
            <button
              onClick={onAddWidget}
              className="px-2.5 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 active:bg-emerald-700 transition flex items-center gap-1 sm:gap-1.5 md:gap-2 text-sm sm:text-base"
            >
              <span className="text-base sm:text-lg">+</span>
              <span className="hidden xs:inline">Add</span>
              <span className="hidden sm:inline">Widget</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
            <button
              onClick={handleExport}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300 text-left"
            >
              📤 Export Dashboard
            </button>

            <label className="cursor-pointer w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300 text-left">
              📥 Import Dashboard
              <input
                type="file"
                accept="application/json"
                hidden
                onChange={handleImport}
              />
            </label>
          </div>
        )}
      </div>
    </nav>
  );
}
