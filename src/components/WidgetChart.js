"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

/**
 * ✅ Minimal, safe registration
 */
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
);

export default function WidgetChart({ dragListeners }) {
  // 📈 Mock Groww stock LINE data
  const lineData = {
    labels: ["09:30", "10:00", "10:30", "11:00", "11:30", "12:00"],
    datasets: [
      {
        label: "Groww",
        data: [230, 235, 228, 240, 245, 250],
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.15)",
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  return (
    <div className="md:col-span-2 rounded-xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span
            {...dragListeners}
            className="cursor-grab text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            ⠿
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            Groww Stock Price
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full
                           bg-slate-200 dark:bg-slate-800
                           text-slate-500">
            1D
          </span>
        </div>
        <span className="text-sm text-slate-500">Mock data</span>
      </div>

      {/* Line Chart */}
      <Line
        data={lineData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            x: {
              grid: { display: false },
            },
            y: {
              grid: { color: "#334155" },
            },
          },
        }}
      />

      {/* Footer */}
      <div className="mt-4 text-xs text-center text-slate-400">
        Last updated: 10:45 AM
      </div>
    </div>
  );
}
