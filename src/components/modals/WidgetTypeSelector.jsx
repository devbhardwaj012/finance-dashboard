"use client";

/**
 * WidgetTypeSelector
 *
 * UI control for selecting the type of widget to create.
 * Responsibilities:
 * - Present available widget types (card, table, chart)
 * - Visually indicate the currently selected type
 * - Notify the parent component when selection changes
 *
 * The component is fully controlled via props and
 * does not maintain internal state.
 */
export default function WidgetTypeSelector({ value, onChange }) {
  /**
   * Supported widget types and their metadata.
   * This definition drives both rendering and selection logic.
   */
  const types = [
    { id: "card", label: "Card", icon: "📊", desc: "Display values" },
    { id: "table", label: "Table", icon: "📋", desc: "Show rows" },
    { id: "chart", label: "Chart", icon: "📈", desc: "Time series" },
  ];

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
        Widget Type
      </label>

      {/* 
        Responsive layout:
        - Mobile: horizontal scroll for touch-friendly selection
        - Desktop: grid layout for structured comparison
      */}
      <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
        {types.map((type) => {
          const isActive = value === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              className={`min-w-[120px] sm:min-w-0 p-3 rounded-lg border-2 text-center transition flex-shrink-0
                ${
                  isActive
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-emerald-400"
                }
              `}
            >
              <div className="text-2xl">{type.icon}</div>
              <div className="font-semibold text-sm mt-1">{type.label}</div>
              <div className="text-xs opacity-80 mt-1 hidden sm:block">
                {type.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
