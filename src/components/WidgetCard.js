export default function WidgetCard({ dragListeners }) {
  return (
    <div className="relative rounded-xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            {...dragListeners}
            className="cursor-grab text-slate-400 hover:text-slate-600"
          >
            ⠿
          </span>
          <span className="font-semibold">Bitcoin</span>
        </div>

        <div className="flex gap-3 text-slate-400">
          ⟳ ⚙ 🗑
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">currency</span>
          <span className="font-semibold">BTC</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">INR</span>
          <span className="font-mono">9,738,378.76</span>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        Last updated: 01:14:08
      </div>
    </div>
  );
}
