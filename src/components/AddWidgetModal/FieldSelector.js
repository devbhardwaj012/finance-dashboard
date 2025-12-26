"use client";

import { useState } from "react";

export default function FieldSelector({ fields, selected, onChange }) {
  const [search, setSearch] = useState("");

  const allFields = Object.keys(fields || {}).filter((f) =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  function addField(field) {
    if (!selected.includes(field)) {
      onChange([...selected, field]);
    }
  }

  function removeField(field) {
    onChange(selected.filter((f) => f !== field));
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Section title */}
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Configure Data Mapping
      </h3>

      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for fields..."
          className="
            flex-1 px-3 py-2 rounded-md
            bg-white text-slate-900 border border-slate-300
            dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
            focus:outline-none focus:ring-2 focus:ring-emerald-500
          "
        />
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {allFields.length} fields
        </span>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Available Fields */}
        <div
          className="
            rounded-lg border
            bg-white border-slate-200
            dark:bg-slate-900 dark:border-slate-700
          "
        >
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300">
            Available Fields
          </div>

          <div className="max-h-[260px] overflow-y-auto p-2 space-y-2">
            {allFields.map((field) => (
              <div
                key={field}
                className="
                  flex items-center justify-between px-3 py-2 rounded-md
                  bg-slate-50 hover:bg-slate-100
                  dark:bg-slate-800 dark:hover:bg-slate-700
                  text-sm text-slate-700 dark:text-slate-200
                "
              >
                <span className="truncate">{field}</span>
                <button
                  type="button"
                  onClick={() => addField(field)}
                  className="
                    ml-2 px-2 py-1 rounded
                    bg-emerald-500 hover:bg-emerald-400
                    text-white text-xs
                  "
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Fields */}
        <div
          className="
            rounded-lg border
            bg-white border-slate-200
            dark:bg-slate-900 dark:border-slate-700
          "
        >
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300">
            Selected Fields
          </div>

          <div className="max-h-[260px] overflow-y-auto p-2 space-y-2">
            {selected.length === 0 && (
              <div className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
                No fields selected
              </div>
            )}

            {selected.map((field) => (
              <div
                key={field}
                className="
                  flex items-center justify-between px-3 py-2 rounded-md
                  bg-slate-50
                  dark:bg-slate-800
                  text-sm text-slate-700 dark:text-slate-200
                "
              >
                <span className="truncate">{field}</span>
                <button
                  type="button"
                  onClick={() => removeField(field)}
                  className="
                    ml-2 px-2 py-1 rounded
                    bg-red-500 hover:bg-red-400
                    text-white text-xs
                  "
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
