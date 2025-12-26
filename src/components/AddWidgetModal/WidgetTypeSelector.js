"use client";

export default function WidgetTypeSelector({ value, onChange }) {
  return (
    <div className="flex gap-2 my-4">
      {["card", "table", "chart"].map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`px-4 py-2 rounded-md text-sm border transition
            ${
              value === type
                ? "bg-emerald-500 text-white border-emerald-500"
                : "border-slate-600 text-slate-300 hover:border-emerald-400"
            }`}
        >
          {type.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
