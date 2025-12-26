"use client";

export default function FieldSelector({
  fields,
  selected = [],
  onChange,
}) {
  // 🛡 Normalize fields → always an array
  const safeFields = Array.isArray(fields) ? fields : [];

  function add(fieldPath) {
    if (!selected.includes(fieldPath)) {
      onChange([...selected, fieldPath]);
    }
  }

  function remove(fieldPath) {
    onChange(selected.filter((f) => f !== fieldPath));
  }

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {/* ===============================
          Available Fields
         =============================== */}
      <div>
        <h4 className="font-medium mb-2 text-slate-700 dark:text-slate-300">
          Available Fields
        </h4>

        <div className="space-y-2 max-h-64 overflow-auto">
          {safeFields.length === 0 && (
            <div className="text-sm text-slate-400">
              No scalar fields detected
            </div>
          )}

          {safeFields.map((field) => (
            <div
              key={field.path}
              className="
                flex justify-between items-center
                p-2 rounded-md
                bg-slate-100 dark:bg-slate-800
              "
            >
              <span className="truncate text-sm text-slate-700 dark:text-slate-200">
                {field.label}
              </span>

              <button
                type="button"
                onClick={() => add(field.path)}
                className="text-emerald-500 font-bold text-lg"
                title="Add field"
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ===============================
          Selected Fields
         =============================== */}
      <div>
        <h4 className="font-medium mb-2 text-slate-700 dark:text-slate-300">
          Selected Fields
        </h4>

        <div className="space-y-2">
          {selected.length === 0 && (
            <div className="text-sm text-slate-400">
              No fields selected
            </div>
          )}

          {selected.map((fieldPath) => (
            <div
              key={fieldPath}
              className="
                flex justify-between items-center
                p-2 rounded-md
                bg-slate-200 dark:bg-slate-700
              "
            >
              <span className="truncate text-sm text-slate-800 dark:text-slate-100">
                {fieldPath}
              </span>

              <button
                type="button"
                onClick={() => remove(fieldPath)}
                className="text-red-500 font-bold"
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
