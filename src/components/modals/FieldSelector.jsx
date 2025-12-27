"use client";

export default function FieldSelector({
  fields = [],
  selected = [],
  onChange,
}) {
  const safeFields = Array.isArray(fields) ? fields : [];
  const safeSelected = Array.isArray(selected) ? selected : [];

  function add(fieldPath) {
    if (!safeSelected.includes(fieldPath)) {
      onChange([...safeSelected, fieldPath]);
    }
  }

  function remove(fieldPath) {
    onChange(safeSelected.filter((f) => f !== fieldPath));
  }

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {/* Available Fields */}
      <div>
        <h4 className="font-medium mb-2 text-slate-700 dark:text-slate-300">
          Available Fields
        </h4>

        <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-md p-2">
          {safeFields.length === 0 && (
            <div className="text-sm text-slate-400 text-center py-4">
              No fields detected
            </div>
          )}

          {safeFields.map((field) => {
            const isSelected = safeSelected.includes(field.path);

            return (
              <div
                key={field.path}
                className="flex justify-between items-center p-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <span className="truncate text-sm text-slate-700 dark:text-slate-200 flex-1 mr-2">
                  {field.label}
                </span>

                <button
                  type="button"
                  disabled={isSelected}
                  onClick={() => add(field.path)}
                  className={`font-bold text-lg px-2 ${
                    isSelected
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-emerald-500 hover:text-emerald-600"
                  }`}
                  title={isSelected ? "Already added" : "Add field"}
                >
                  +
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Fields */}
      <div>
        <h4 className="font-medium mb-2 text-slate-700 dark:text-slate-300">
          Selected Fields
        </h4>

        <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-md p-2">
          {safeSelected.length === 0 && (
            <div className="text-sm text-slate-400 text-center py-4">
              No fields selected
            </div>
          )}

          {safeSelected.map((fieldPath) => (
            <div
              key={fieldPath}
              className="flex justify-between items-center p-2 rounded-md bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition"
            >
              <span className="truncate text-sm text-slate-800 dark:text-slate-100 flex-1 mr-2">
                {fieldPath.replace(/\./g, " → ")}
              </span>

              <button
                type="button"
                onClick={() => remove(fieldPath)}
                className="text-red-500 hover:text-red-600 font-bold px-2"
                title="Remove field"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}