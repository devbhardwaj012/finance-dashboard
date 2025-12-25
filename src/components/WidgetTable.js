"use client";

export default function WidgetTable({ dragListeners, onDelete }) {
  const data = [
    { company: "Uti Silver Etf", price: 114.2, high: 114.73 },
    { company: "Mirae Asset MF Silver Etf", price: 114.92, high: 114.7 },
    { company: "SBI Fix Sr54", price: 16.03, high: 16.22 },
    { company: "HDFC Gold Etf", price: 87, high: 88.21 },
    { company: "ABSL Fmurn", price: 110.16, high: 110.16 },
    { company: "Motilal Oswal Midcap 100", price: 60.32, high: 22 },
  ];

  return (
    <div className="md:col-span-2 rounded-xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <span
            {...dragListeners}
            className="cursor-grab text-slate-400 hover:text-slate-600"
          >
            ⠿
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            52 week high
          </span>
        </div>

        <button
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500"
          title="Delete widget"
        >
          🗑
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Search table..."
        className="mb-4 w-full max-w-xs rounded-md px-3 py-2 text-sm
                   bg-slate-100 dark:bg-slate-800
                   border border-slate-300 dark:border-slate-700"
      />

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
            <th className="py-2 text-left">company</th>
            <th className="py-2 text-left">price</th>
            <th className="py-2 text-left">52_week_high</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 dark:border-slate-800"
            >
              <td className="py-2">{row.company}</td>
              <td className="py-2">{row.price}</td>
              <td className="py-2">{row.high}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-xs text-center text-slate-400">
        Last updated: 18:58:26
      </div>
    </div>
  );
}
