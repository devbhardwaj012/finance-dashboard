// "use client";

// import { useEffect, useState } from "react";
// import { fetchApi } from "@/lib/api/fetchApi";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// export default function ChartWidget({
//   widget,
//   dragListeners,
//   onDelete,
//   onEdit,
// }) {
//   const { name, url, interval, arrayPath, fields } = widget;

//   const [data, setData] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState(null);

//   /* ===============================
//      🔁 Fetch & prepare data
//      =============================== */
//   async function loadData() {
//     try {
//       setLoading(true);
//       setError(null);

//       const json = await fetchApi(url);

//       const arrayData = arrayPath
//         .split(".")
//         .reduce((acc, key) => acc?.[key], json);

//       if (!arrayData || typeof arrayData !== "object") {
//         throw new Error("Invalid arrayPath for chart");
//       }

//       /**
//        * Alpha Vantage returns:
//        * {
//        *   "2025-12-24": { open, high, low, close }
//        * }
//        *
//        * Convert → [{ x: date, open, close }]
//        */
//       const normalized = Object.entries(arrayData)
//         .map(([key, value]) => {
//           const row = { x: key };
//           fields.forEach((f) => {
//             const v = value?.[f];
//             row[f] = isNaN(Number(v)) ? null : Number(v);
//           });
//           return row;
//         })
//         .reverse(); // chronological order

//       setData(normalized);
//       setLastUpdated(new Date());
//     } catch (err) {
//       setError(err.message || "Failed to load chart data");
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* ===============================
//      ⏱ Auto-refresh
//      =============================== */
//   useEffect(() => {
//     loadData();

//     if (!interval || interval <= 0) return;
//     const id = setInterval(loadData, interval * 1000);

//     return () => clearInterval(id);
//   }, [url, interval, arrayPath, fields.join(",")]);

//   return (
//     <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">

//       {/* ===============================
//          Header
//          =============================== */}
//       <div className="flex items-center justify-between px-5 py-3 border-b">
//         <div className="flex items-center gap-3">
//           <h3 className="font-semibold text-slate-900 dark:text-white">
//             {name}
//           </h3>
//           <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
//             {interval}s
//           </span>
//         </div>

//         <div className="flex items-center gap-3">
//           <button {...dragListeners} title="Drag">⠿</button>
//           <button onClick={() => onEdit(widget)} title="Edit">⚙️</button>
//           <button onClick={onDelete} className="text-red-500">✕</button>
//         </div>
//       </div>

//       {/* ===============================
//          Body
//          =============================== */}
//       <div className="h-64 px-3 py-2">
//         {loading && <div className="text-sm text-slate-400">Loading chart…</div>}
//         {error && <div className="text-sm text-red-500">{error}</div>}

//         {!loading && !error && data.length > 0 && (
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//               <XAxis dataKey="x" tick={{ fontSize: 12 }} />
//               <YAxis tick={{ fontSize: 12 }} />
//               <Tooltip />

//               {fields.map((field, idx) => (
//                 <Line
//                   key={field}
//                   type="monotone"
//                   dataKey={field}
//                   stroke={`hsl(${idx * 80}, 70%, 50%)`}
//                   dot={false}
//                   strokeWidth={2}
//                 />
//               ))}
//             </LineChart>
//           </ResponsiveContainer>
//         )}
//       </div>

//       {/* ===============================
//          Footer
//          =============================== */}
//       {lastUpdated && (
//         <div className="px-4 py-2 text-xs text-slate-400 text-right">
//           Last updated: {lastUpdated.toLocaleTimeString()}
//         </div>
//       )}
//     </div>
//   );
// }






















// the correct one is above 





















"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api/fetchApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * ChartWidget
 * - Time series chart
 * - X = date
 * - Y = selected numeric field
 */
export default function ChartWidget({ widget }) {
  const { name, url, interval, seriesPath, yField } = widget;

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  function readPath(obj, path) {
    return path.split(".").reduce((acc, k) => acc?.[k], obj);
  }

  async function loadData() {
    try {
      setError(null);
      const json = await fetchApi(url);
      const series = readPath(json, seriesPath);

      if (!series || typeof series !== "object") {
        throw new Error("Invalid series path");
      }

      // Convert time series → chart data
      const formatted = Object.entries(series)
        .map(([date, values]) => ({
          date,
          value: Number(values?.[yField]),
        }))
        .filter((d) => !Number.isNaN(d.value))
        .reverse(); // oldest → newest

      setData(formatted);
    } catch (err) {
      setError(err.message || "Failed to load chart");
    }
  }

  useEffect(() => {
    loadData();
    if (!interval) return;
    const id = setInterval(loadData, interval * 1000);
    return () => clearInterval(id);
  }, [url, interval, seriesPath, yField]);

  return (
    <div className="rounded-xl border bg-white dark:bg-slate-900 p-4 shadow-sm">
      <h3 className="font-semibold mb-3">{name}</h3>

      {error && <div className="text-sm text-red-500">{error}</div>}

      {!error && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
