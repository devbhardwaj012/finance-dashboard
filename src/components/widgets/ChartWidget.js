// // "use client";
// // import { useEffect, useState } from "react";
// // import { fetchApi } from "@/lib/api/fetchApi";
// // import { readPath } from "@/lib/api/validateApi";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   ResponsiveContainer,
// //   CartesianGrid,
// // } from "recharts";

// // export default function ChartWidget({ widget, dragListeners, onEdit, onDelete }) {
// //   const { name, url, interval, seriesPath, yField } = widget;

// //   const [data, setData] = useState([]);
// //   const [error, setError] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   async function loadData() {
// //     if (!seriesPath || !yField) return;

// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const json = await fetchApi(url);
// //       const series = readPath(json, seriesPath);

// //       if (!series) {
// //         throw new Error("Invalid series path");
// //       }

// //       let formatted = [];

// //       // Object with date keys (Alpha Vantage style)
// //       if (typeof series === "object" && !Array.isArray(series)) {
// //         formatted = Object.entries(series)
// //           .map(([date, values]) => ({
// //             date,
// //             value: Number(values?.[yField]),
// //           }))
// //           .filter((d) => Number.isFinite(d.value))
// //           .sort((a, b) => new Date(a.date) - new Date(b.date));
// //       }
// //       // Array of objects
// //       else if (Array.isArray(series)) {
// //         formatted = series
// //           .map((item) => ({
// //             date: item.date || item.time || item.timestamp || String(item[Object.keys(item)[0]]),
// //             value: Number(item[yField]),
// //           }))
// //           .filter((d) => Number.isFinite(d.value));
// //       }

// //       if (formatted.length === 0) {
// //         throw new Error("No valid data points found");
// //       }

// //       setData(formatted);
// //     } catch (err) {
// //       setError(err.message || "Failed to load chart");
// //       setData([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   useEffect(() => {
// //     loadData();

// //     if (!interval) return;
// //     const id = setInterval(loadData, interval * 1000);
// //     return () => clearInterval(id);
// //   }, [url, interval, seriesPath, yField]);

// //   return (
// //     <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow">
// //       <div className="flex items-center justify-between mb-3">
// //         <div className="flex items-center gap-3">
// //           <h3 className="font-semibold text-slate-900 dark:text-white">{name}</h3>
// //           <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
// //             {interval}s
// //           </span>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <button {...dragListeners} className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1" title="Drag">⠿</button>
// //           <button onClick={() => onEdit(widget)} className="text-slate-400 hover:text-slate-600 p-1" title="Edit">⚙️</button>
// //           <button onClick={onDelete} className="text-red-500 hover:text-red-600 p-1" title="Delete">✕</button>
// //         </div>
// //       </div>

// //       {loading && <div className="text-sm text-slate-400 animate-pulse">Loading chart…</div>}
// //       {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}

// //       {!loading && !error && data.length === 0 && (
// //         <div className="text-sm text-slate-400 text-center py-8">
// //           No chart data. Click ⚙️ to reconfigure.
// //         </div>
// //       )}

// //       {!loading && !error && data.length > 0 && (
// //         <div className="h-72">
// //           <ResponsiveContainer width="100%" height="100%">
// //             <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
// //               <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
// //               <XAxis
// //                 dataKey="date"
// //                 tick={{ fontSize: 11 }}
// //                 angle={-45}
// //                 textAnchor="end"
// //                 height={70}
// //                 stroke="#64748b"
// //               />
// //               <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
// //               <Tooltip
// //                 contentStyle={{
// //                   backgroundColor: "rgba(255, 255, 255, 0.95)",
// //                   border: "1px solid #e2e8f0",
// //                   borderRadius: "8px",
// //                 }}
// //               />
// //               <Line
// //                 type="monotone"
// //                 dataKey="value"
// //                 stroke="#10b981"
// //                 strokeWidth={2}
// //                 dot={false}
// //                 activeDot={{ r: 6 }}
// //               />
// //             </LineChart>
// //           </ResponsiveContainer>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }






















// // "use client";
// // import { useEffect, useState } from "react";
// // import { fetchApi } from "@/lib/api/fetchApi";
// // import { readPath } from "@/lib/api/validateApi";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   ResponsiveContainer,
// //   CartesianGrid,
// // } from "recharts";

// // export default function ChartWidget({ widget, dragListeners, onEdit, onDelete }) {
// //   const { name, url, interval, seriesPath, yField } = widget;

// //   const [data, setData] = useState([]);
// //   const [error, setError] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   async function loadData() {
// //     if (!seriesPath || !yField) {
// //       setError("Chart not configured. Click ⚙️ to set up.");
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const json = await fetchApi(url);
      
// //       // Debug: Show what we received
// //       console.log('=== CHART DEBUG ===');
// //       console.log('Full API Response:', json);
// //       console.log('Looking for path:', seriesPath);
// //       console.log('Available top-level keys:', Object.keys(json));
      
// //       const series = readPath(json, seriesPath);
      
// //       console.log('Extracted series data:', series);
// //       console.log('Series type:', Array.isArray(series) ? 'Array' : typeof series);

// //       if (!series) {
// //         // Show helpful error with available paths
// //         const availableKeys = Object.keys(json).join(', ');
// //         throw new Error(
// //           `Path "${seriesPath}" not found. Available keys: ${availableKeys}`
// //         );
// //       }

// //       let formatted = [];

// //       // Case 1: Object with date keys (Alpha Vantage style)
// //       if (typeof series === "object" && !Array.isArray(series)) {
// //         const entries = Object.entries(series);
        
// //         console.log('Processing as object. Sample entry:', entries[0]);
        
// //         if (entries.length === 0) {
// //           throw new Error("Time series is empty");
// //         }

// //         // Get first entry to check structure
// //         const [firstDate, firstValues] = entries[0];
// //         console.log('First date:', firstDate);
// //         console.log('First values:', firstValues);
// //         console.log('Available fields:', Object.keys(firstValues || {}));
// //         console.log('Looking for Y-field:', yField);

// //         formatted = entries
// //           .map(([date, values]) => {
// //             const yValue = values?.[yField];
// //             const numericValue = Number(yValue);
            
// //             if (!Number.isFinite(numericValue)) {
// //               console.warn(`Skipping ${date}: "${yField}" = ${yValue} (not numeric)`);
// //               return null;
// //             }
            
// //             return {
// //               date,
// //               value: numericValue,
// //             };
// //           })
// //           .filter(Boolean)
// //           .sort((a, b) => new Date(a.date) - new Date(b.date));
// //       }
// //       // Case 2: Array of objects
// //       else if (Array.isArray(series)) {
// //         console.log('Processing as array. Sample item:', series[0]);
        
// //         if (series.length === 0) {
// //           throw new Error("Time series array is empty");
// //         }

// //         formatted = series
// //           .map((item) => {
// //             const dateValue = item.date || item.time || item.timestamp || item.x;
// //             const yValue = item[yField];
// //             const numericValue = Number(yValue);
            
// //             if (!dateValue || !Number.isFinite(numericValue)) {
// //               return null;
// //             }
            
// //             return {
// //               date: String(dateValue),
// //               value: numericValue,
// //             };
// //           })
// //           .filter(Boolean);
// //       }
// //       else {
// //         throw new Error(`Series must be an object or array, got: ${typeof series}`);
// //       }

// //       if (formatted.length === 0) {
// //         throw new Error(
// //           `No valid data points found. Check if field "${yField}" exists and contains numbers.`
// //         );
// //       }

// //       console.log('Successfully formatted', formatted.length, 'data points');
// //       console.log('Sample:', formatted.slice(0, 3));
// //       console.log('=== END DEBUG ===');
      
// //       setData(formatted);
// //     } catch (err) {
// //       console.error('❌ Chart error:', err.message);
// //       setError(err.message || "Failed to load chart");
// //       setData([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   useEffect(() => {
// //     loadData();

// //     if (!interval) return;
// //     const id = setInterval(loadData, interval * 1000);
// //     return () => clearInterval(id);
// //   }, [url, interval, seriesPath, yField]);

// //   return (
// //     <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow">
// //       <div className="flex items-center justify-between mb-3">
// //         <div className="flex items-center gap-3">
// //           <h3 className="font-semibold text-slate-900 dark:text-white">{name}</h3>
// //           <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
// //             {interval}s
// //           </span>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <button {...dragListeners} className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1" title="Drag">⠿</button>
// //           <button onClick={() => onEdit(widget)} className="text-slate-400 hover:text-slate-600 p-1" title="Edit">⚙️</button>
// //           <button onClick={onDelete} className="text-red-500 hover:text-red-600 p-1" title="Delete">✕</button>
// //         </div>
// //       </div>

// //       {loading && <div className="text-sm text-slate-400 animate-pulse">Loading chart…</div>}
// //       {error && (
// //         <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">
// //           <div className="font-semibold mb-1">⚠️ Chart Error</div>
// //           <div className="whitespace-pre-wrap">{error}</div>
// //           <div className="mt-2 text-xs opacity-75">Check browser console for details</div>
// //         </div>
// //       )}

// //       {!loading && !error && data.length === 0 && (
// //         <div className="text-sm text-slate-400 text-center py-8">
// //           No chart data. Click ⚙️ to reconfigure.
// //         </div>
// //       )}

// //       {!loading && !error && data.length > 0 && (
// //         <div className="h-72">
// //           <ResponsiveContainer width="100%" height="100%">
// //             <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
// //               <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
// //               <XAxis
// //                 dataKey="date"
// //                 tick={{ fontSize: 11 }}
// //                 angle={-45}
// //                 textAnchor="end"
// //                 height={70}
// //                 stroke="#64748b"
// //               />
// //               <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
// //               <Tooltip
// //                 contentStyle={{
// //                   backgroundColor: "rgba(255, 255, 255, 0.95)",
// //                   border: "1px solid #e2e8f0",
// //                   borderRadius: "8px",
// //                 }}
// //               />
// //               <Line
// //                 type="monotone"
// //                 dataKey="value"
// //                 stroke="#10b981"
// //                 strokeWidth={2}
// //                 dot={false}
// //                 activeDot={{ r: 6 }}
// //               />
// //             </LineChart>
// //           </ResponsiveContainer>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
























// "use client";
// import { useEffect, useState } from "react";
// import { fetchApi } from "@/lib/api/fetchApi";
// import { readPath } from "@/lib/api/validateApi";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// export default function ChartWidget({ widget, dragListeners, onEdit, onDelete }) {
//   const { name, url, interval, seriesPath, yField } = widget;

//   const [data, setData] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Helper to find nested objects recursively
//   function findInObject(obj, targetPath, currentPath = '') {
//     if (!obj || typeof obj !== 'object') return null;
    
//     // Try direct path first
//     const direct = readPath(obj, targetPath);
//     if (direct) return direct;
    
//     // Search through all nested objects
//     for (const [key, value] of Object.entries(obj)) {
//       const fullPath = currentPath ? `${currentPath}.${key}` : key;
      
//       // Check if this is our target
//       if (fullPath === targetPath || key === targetPath) {
//         return value;
//       }
      
//       // Recurse into nested objects
//       if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
//         const found = findInObject(value, targetPath, fullPath);
//         if (found) return found;
//       }
//     }
    
//     return null;
//   }

//   // Helper to show object structure
//   function getObjectStructure(obj, depth = 0, maxDepth = 3) {
//     if (depth > maxDepth) return '...';
//     if (!obj || typeof obj !== 'object') return typeof obj;
//     if (Array.isArray(obj)) return `Array[${obj.length}]`;
    
//     const keys = Object.keys(obj);
//     if (keys.length === 0) return '{}';
    
//     const preview = keys.slice(0, 5).map(k => {
//       const val = obj[k];
//       if (typeof val === 'object' && val !== null) {
//         return `${k}: ${getObjectStructure(val, depth + 1, maxDepth)}`;
//       }
//       return k;
//     }).join(', ');
    
//     return `{ ${preview}${keys.length > 5 ? ', ...' : ''} }`;
//   }

//   async function loadData() {
//     if (!seriesPath || !yField) {
//       setError("Chart not configured. Click ⚙️ to set up.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const json = await fetchApi(url);
      
//       console.log('=== CHART DEBUG START ===');
//       console.log('1. Full API Response:', json);
//       console.log('2. Response structure:', getObjectStructure(json));
//       console.log('3. Looking for series path:', seriesPath);
//       console.log('4. Looking for Y-field:', yField);
      
//       // Try to find the series data intelligently
//       let series = findInObject(json, seriesPath);
      
//       console.log('5. Found series:', series ? 'YES' : 'NO');
      
//       if (series) {
//         console.log('6. Series structure:', getObjectStructure(series));
//       }

//       if (!series) {
//         // Build helpful error message
//         const structure = getObjectStructure(json);
//         throw new Error(
//           `Cannot find "${seriesPath}". API structure: ${structure}\n\n` +
//           `Check the browser console for the full response and verify the path in your widget settings.`
//         );
//       }

//       let formatted = [];

//       // Case 1: Object with date keys (Alpha Vantage style)
//       if (typeof series === "object" && !Array.isArray(series)) {
//         const entries = Object.entries(series);
        
//         if (entries.length === 0) {
//           throw new Error("Time series is empty");
//         }

//         const [firstDate, firstValues] = entries[0];
//         console.log('7. Processing as date-keyed object');
//         console.log('8. First date:', firstDate);
//         console.log('9. First values:', firstValues);
//         console.log('10. Available Y-fields:', Object.keys(firstValues || {}));

//         // Check if Y-field exists
//         if (firstValues && !(yField in firstValues)) {
//           const availableFields = Object.keys(firstValues).join(', ');
//           throw new Error(
//             `Field "${yField}" not found. Available fields: ${availableFields}`
//           );
//         }

//         formatted = entries
//           .map(([date, values]) => {
//             const yValue = values?.[yField];
//             const numericValue = Number(yValue);
            
//             if (!Number.isFinite(numericValue)) {
//               return null;
//             }
            
//             return { date, value: numericValue };
//           })
//           .filter(Boolean)
//           .sort((a, b) => new Date(a.date) - new Date(b.date));
//       }
//       // Case 2: Array of objects
//       else if (Array.isArray(series)) {
//         console.log('7. Processing as array');
//         console.log('8. Array length:', series.length);
//         console.log('9. First item:', series[0]);
        
//         if (series.length === 0) {
//           throw new Error("Time series array is empty");
//         }

//         const firstItem = series[0];
//         const availableFields = Object.keys(firstItem);
//         console.log('10. Available fields:', availableFields);

//         formatted = series
//           .map((item) => {
//             const dateValue = item.date || item.time || item.timestamp || item.x;
//             const yValue = item[yField];
//             const numericValue = Number(yValue);
            
//             if (!dateValue || !Number.isFinite(numericValue)) {
//               return null;
//             }
            
//             return {
//               date: String(dateValue),
//               value: numericValue,
//             };
//           })
//           .filter(Boolean);
//       }
//       else {
//         throw new Error(
//           `Series data must be an object or array. Got: ${typeof series}`
//         );
//       }

//       if (formatted.length === 0) {
//         throw new Error(
//           `No valid numeric data found for field "${yField}". ` +
//           `Make sure the field contains numbers and exists in every data point.`
//         );
//       }

//       console.log('11. ✅ Success! Formatted', formatted.length, 'data points');
//       console.log('12. Sample data:', formatted.slice(0, 3));
//       console.log('=== CHART DEBUG END ===');
      
//       setData(formatted);
//     } catch (err) {
//       console.error('❌ Chart error:', err.message);
//       console.log('=== CHART DEBUG END ===');
//       setError(err.message || "Failed to load chart");
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadData();

//     if (!interval) return;
//     const id = setInterval(loadData, interval * 1000);
//     return () => clearInterval(id);
//   }, [url, interval, seriesPath, yField]);

//   return (
//     <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-3">
//           <h3 className="font-semibold text-slate-900 dark:text-white">{name}</h3>
//           <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
//             {interval}s
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <button {...dragListeners} className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1" title="Drag">⠿</button>
//           <button onClick={() => onEdit(widget)} className="text-slate-400 hover:text-slate-600 p-1" title="Edit">⚙️</button>
//           <button onClick={onDelete} className="text-red-500 hover:text-red-600 p-1" title="Delete">✕</button>
//         </div>
//       </div>

//       {loading && <div className="text-sm text-slate-400 animate-pulse">Loading chart…</div>}
      
//       {error && (
//         <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">
//           <div className="font-semibold mb-2">⚠️ Chart Configuration Error</div>
//           <div className="whitespace-pre-wrap text-xs mb-3">{error}</div>
//           <button
//             onClick={() => onEdit(widget)}
//             className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//           >
//             Fix Configuration
//           </button>
//         </div>
//       )}

//       {!loading && !error && data.length === 0 && (
//         <div className="text-sm text-slate-400 text-center py-8">
//           <div className="text-4xl mb-2">📈</div>
//           <div>No chart data available</div>
//           <button
//             onClick={() => onEdit(widget)}
//             className="mt-3 text-xs text-emerald-500 hover:text-emerald-600"
//           >
//             Configure Widget
//           </button>
//         </div>
//       )}

//       {!loading && !error && data.length > 0 && (
//         <div className="h-72">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//               <XAxis
//                 dataKey="date"
//                 tick={{ fontSize: 11 }}
//                 angle={-45}
//                 textAnchor="end"
//                 height={70}
//                 stroke="#64748b"
//               />
//               <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "rgba(255, 255, 255, 0.95)",
//                   border: "1px solid #e2e8f0",
//                   borderRadius: "8px",
//                 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="value"
//                 stroke="#10b981"
//                 strokeWidth={2}
//                 dot={false}
//                 activeDot={{ r: 6 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </div>
//   );
// }
















"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api/fetchApi";
import { readPath } from "@/lib/api/validateApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Debug mode - set to false in production
const DEBUG = process.env.NODE_ENV === 'development';

function debugLog(...args) {
  if (DEBUG) console.log(...args);
}

function debugError(...args) {
  if (DEBUG) console.error(...args);
}

export default function ChartWidget({ widget, dragListeners, onEdit, onDelete }) {
  const { name, url, interval, seriesPath, yField } = widget;
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  async function loadData() {
    if (!seriesPath || !yField) {
      setError("Chart not configured. Click ⚙️ to set up.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const json = await fetchApi(url);
      
      debugLog('=== CHART LOAD DEBUG ===');
      debugLog('Widget config:', { seriesPath, yField });
      debugLog('API Response:', json);
      debugLog('Response keys:', Object.keys(json));
      debugLog('Full response structure:', JSON.stringify(json, null, 2));
      
      // Use the EXACT readPath function
      const series = readPath(json, seriesPath);
      
      debugLog('Series found:', series ? 'YES' : 'NO');
      if (series) {
        debugLog('Series type:', Array.isArray(series) ? 'Array' : typeof series);
        debugLog('Series sample:', Array.isArray(series) ? series[0] : Object.keys(series).slice(0, 3));
      }

      if (!series) {
        // Get available paths for better error message
        const availablePaths = [];
        function getPaths(obj, prefix = '') {
          if (!obj || typeof obj !== 'object') return;
          for (const key in obj) {
            const path = prefix ? `${prefix}.${key}` : key;
            availablePaths.push(path);
            if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
              getPaths(obj[key], path);
            }
          }
        }
        getPaths(json);
        
        // Check if this is an API error response
        const errorMsg = json.Information || json.Error || json.error || json.message;
        if (errorMsg) {
          throw new Error(
            `API Error: ${errorMsg}\n\n` +
            `This usually means:\n` +
            `- API rate limit exceeded (Alpha Vantage allows 25 requests/day on demo key)\n` +
            `- Invalid API key\n` +
            `- Invalid symbol or parameters\n\n` +
            `Try using your own API key from https://www.alphavantage.co/support/#api-key`
          );
        }
        
        throw new Error(
          `Path "${seriesPath}" not found.\n\n` +
          `Available paths:\n${availablePaths.slice(0, 10).join('\n')}\n\n` +
          `Check the exact spelling and capitalization in your widget settings.`
        );
      }

      let formatted = [];

      // Case 1: Object with date keys (Alpha Vantage, Crypto APIs)
      if (typeof series === "object" && !Array.isArray(series)) {
        const entries = Object.entries(series);
        
        if (entries.length === 0) {
          throw new Error("Time series is empty");
        }

        const [firstDate, firstValues] = entries[0];
        debugLog('Processing date-keyed object');
        debugLog('First date:', firstDate);
        debugLog('First values:', firstValues);
        debugLog('Available Y-fields:', Object.keys(firstValues || {}));

        // Validate Y-field exists
        if (!firstValues || !(yField in firstValues)) {
          const availableFields = firstValues ? Object.keys(firstValues).join(', ') : 'none';
          throw new Error(
            `Field "${yField}" not found in data.\n\n` +
            `Available fields: ${availableFields}\n\n` +
            `Update your widget settings to use one of these fields.`
          );
        }

        formatted = entries
          .map(([date, values]) => {
            const yValue = values?.[yField];
            
            // Try to parse as number
            let numericValue;
            if (typeof yValue === 'string') {
              numericValue = parseFloat(yValue);
            } else {
              numericValue = Number(yValue);
            }
            
            if (!Number.isFinite(numericValue)) {
              if (DEBUG) console.warn(`Skipping ${date}: "${yField}" = "${yValue}" (not numeric)`);
              return null;
            }
            
            return { date, value: numericValue };
          })
          .filter(Boolean)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      // Case 2: Array of objects (REST APIs, GraphQL)
      else if (Array.isArray(series)) {
        debugLog('Processing array format');
        debugLog('Array length:', series.length);
        
        if (series.length === 0) {
          throw new Error("Time series array is empty");
        }

        const firstItem = series[0];
        debugLog('First item:', firstItem);
        debugLog('Available fields:', Object.keys(firstItem));

        // Find date field automatically
        const dateField = 
          firstItem.date ? 'date' :
          firstItem.time ? 'time' :
          firstItem.timestamp ? 'timestamp' :
          firstItem.x ? 'x' :
          Object.keys(firstItem)[0]; // Use first field as fallback

        debugLog('Using date field:', dateField);

        // Validate Y-field exists
        if (!(yField in firstItem)) {
          const availableFields = Object.keys(firstItem).join(', ');
          throw new Error(
            `Field "${yField}" not found in array items.\n\n` +
            `Available fields: ${availableFields}\n\n` +
            `Update your widget settings to use one of these fields.`
          );
        }

        formatted = series
          .map((item, index) => {
            const dateValue = item[dateField];
            const yValue = item[yField];
            
            // Parse numeric value
            let numericValue;
            if (typeof yValue === 'string') {
              numericValue = parseFloat(yValue);
            } else {
              numericValue = Number(yValue);
            }
            
            if (!dateValue || !Number.isFinite(numericValue)) {
              if (DEBUG) console.warn(`Skipping item ${index}: date="${dateValue}" value="${yValue}"`);
              return null;
            }
            
            return {
              date: String(dateValue),
              value: numericValue,
            };
          })
          .filter(Boolean);
      }
      else {
        throw new Error(
          `Series data must be an object or array.\n\n` +
          `Got: ${typeof series}\n\n` +
          `The selected path does not contain valid time-series data.`
        );
      }

      if (formatted.length === 0) {
        throw new Error(
          `No valid data points found.\n\n` +
          `Possible reasons:\n` +
          `- Field "${yField}" doesn't contain numbers\n` +
          `- Date field is missing or invalid\n` +
          `- Data is in wrong format\n\n` +
          `Check browser console for details.`
        );
      }

      debugLog('✅ Success! Formatted', formatted.length, 'data points');
      debugLog('Sample data:', formatted.slice(0, 3));
      debugLog('========================');
      
      setData(formatted);
      setIsInitialLoad(false);
    } catch (err) {
      debugError('❌ Chart error:', err.message);
      debugLog('========================');
      setError(err.message || "Failed to load chart");
      setData([]);
      setIsInitialLoad(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    if (!interval) return;
    const id = setInterval(loadData, interval * 1000);
    return () => clearInterval(id);
  }, [url, interval, seriesPath, yField]);

  // Skeleton loader
  if (isInitialLoad && data.length === 0 && !error) {
    return (
      <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            <div className="h-5 w-12 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-72 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow">
      {loading && !isInitialLoad && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
            <span className="inline-block w-2 h-2 bg-white rounded-full animate-ping"></span>
            Updating
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">{name}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
            {interval}s
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button {...dragListeners} className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1" title="Drag">⠿</button>
          <button onClick={onEdit} className="text-slate-400 hover:text-slate-600 p-1 hover:scale-110 transition-transform" title="Edit">⚙️</button>
          <button onClick={onDelete} className="text-red-500 hover:text-red-600 p-1 hover:scale-110 transition-transform" title="Delete">✕</button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">
          <div className="font-semibold mb-2">⚠️ Chart Configuration Error</div>
          <div className="text-xs mb-3 whitespace-pre-wrap font-mono">{error}</div>
          <div className="flex gap-2">
            <button 
              onClick={onEdit} 
              className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Fix Configuration
            </button>
            {DEBUG && (
              <button 
                onClick={() => console.log('Full widget config:', widget)} 
                className="text-xs bg-slate-500 text-white px-3 py-1 rounded hover:bg-slate-600"
              >
                Log Config
              </button>
            )}
          </div>
        </div>
      )}

      {!error && data.length > 0 && (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11 }} 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                stroke="#64748b" 
              />
              <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.95)", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "8px" 
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}