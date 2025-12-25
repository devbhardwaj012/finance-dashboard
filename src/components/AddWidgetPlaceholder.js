"use client";

export default function AddWidgetPlaceholder({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center
                 w-full max-w-md min-h-[180px]
                 rounded-xl border-2 border-dashed
                 border-slate-300 dark:border-slate-700
                 text-slate-500 dark:text-slate-400
                 hover:border-emerald-500 transition"
    >
      <div className="text-3xl mb-2">＋</div>
      <div className="font-medium">Add Widget</div>
      <div className="text-sm text-center mt-1">
        Connect to a finance API and create a custom widget
      </div>
    </button>
  );
}
