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

// // Debug mode - set to false in production
// const DEBUG = process.env.NODE_ENV === 'development';

// function debugLog(...args) {
//   if (DEBUG) console.log(...args);
// }

// function debugError(...args) {
//   if (DEBUG) console.error(...args);
// }

// export default function ChartWidget({ widget, dragListeners, onEdit, onDelete }) {
//   const { name, url, interval, seriesPath, yField } = widget;
//   const [data, setData] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   async function loadData() {
//     if (!seriesPath || !yField) {
//       setError("Chart not configured. Click ⚙️ to set up.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const json = await fetchApi(url);
      
//       debugLog('=== CHART LOAD DEBUG ===');
//       debugLog('Widget config:', { seriesPath, yField });
//       debugLog('API Response:', json);
//       debugLog('Response keys:', Object.keys(json));
//       debugLog('Full response structure:', JSON.stringify(json, null, 2));
      
//       // Use the EXACT readPath function
//       const series = readPath(json, seriesPath);
      
//       debugLog('Series found:', series ? 'YES' : 'NO');
//       if (series) {
//         debugLog('Series type:', Array.isArray(series) ? 'Array' : typeof series);
//         debugLog('Series sample:', Array.isArray(series) ? series[0] : Object.keys(series).slice(0, 3));
//       }

//       if (!series) {
//         // Get available paths for better error message
//         const availablePaths = [];
//         function getPaths(obj, prefix = '') {
//           if (!obj || typeof obj !== 'object') return;
//           for (const key in obj) {
//             const path = prefix ? `${prefix}.${key}` : key;
//             availablePaths.push(path);
//             if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
//               getPaths(obj[key], path);
//             }
//           }
//         }
//         getPaths(json);
        
//         // Check if this is an API error response
//         const errorMsg = json.Information || json.Error || json.error || json.message;
//         if (errorMsg) {
//           throw new Error(
//             `API Error: ${errorMsg}\n\n` +
//             `This usually means:\n` +
//             `- API rate limit exceeded (Alpha Vantage allows 25 requests/day on demo key)\n` +
//             `- Invalid API key\n` +
//             `- Invalid symbol or parameters\n\n` +
//             `Try using your own API key from https://www.alphavantage.co/support/#api-key`
//           );
//         }
        
//         throw new Error(
//           `Path "${seriesPath}" not found.\n\n` +
//           `Available paths:\n${availablePaths.slice(0, 10).join('\n')}\n\n` +
//           `Check the exact spelling and capitalization in your widget settings.`
//         );
//       }

//       let formatted = [];

//       // Case 1: Object with date keys (Alpha Vantage, Crypto APIs)
//       if (typeof series === "object" && !Array.isArray(series)) {
//         const entries = Object.entries(series);
        
//         if (entries.length === 0) {
//           throw new Error("Time series is empty");
//         }

//         const [firstDate, firstValues] = entries[0];
//         debugLog('Processing date-keyed object');
//         debugLog('First date:', firstDate);
//         debugLog('First values:', firstValues);
//         debugLog('Available Y-fields:', Object.keys(firstValues || {}));

//         // Validate Y-field exists
//         if (!firstValues || !(yField in firstValues)) {
//           const availableFields = firstValues ? Object.keys(firstValues).join(', ') : 'none';
//           throw new Error(
//             `Field "${yField}" not found in data.\n\n` +
//             `Available fields: ${availableFields}\n\n` +
//             `Update your widget settings to use one of these fields.`
//           );
//         }

//         formatted = entries
//           .map(([date, values]) => {
//             const yValue = values?.[yField];
            
//             // Try to parse as number
//             let numericValue;
//             if (typeof yValue === 'string') {
//               numericValue = parseFloat(yValue);
//             } else {
//               numericValue = Number(yValue);
//             }
            
//             if (!Number.isFinite(numericValue)) {
//               if (DEBUG) console.warn(`Skipping ${date}: "${yField}" = "${yValue}" (not numeric)`);
//               return null;
//             }
            
//             return { date, value: numericValue };
//           })
//           .filter(Boolean)
//           .sort((a, b) => new Date(a.date) - new Date(b.date));
//       }
//       // Case 2: Array of objects (REST APIs, GraphQL)
//       else if (Array.isArray(series)) {
//         debugLog('Processing array format');
//         debugLog('Array length:', series.length);
        
//         if (series.length === 0) {
//           throw new Error("Time series array is empty");
//         }

//         const firstItem = series[0];
//         debugLog('First item:', firstItem);
//         debugLog('Available fields:', Object.keys(firstItem));

//         // Find date field automatically
//         const dateField = 
//           firstItem.date ? 'date' :
//           firstItem.time ? 'time' :
//           firstItem.timestamp ? 'timestamp' :
//           firstItem.x ? 'x' :
//           Object.keys(firstItem)[0]; // Use first field as fallback

//         debugLog('Using date field:', dateField);

//         // Validate Y-field exists
//         if (!(yField in firstItem)) {
//           const availableFields = Object.keys(firstItem).join(', ');
//           throw new Error(
//             `Field "${yField}" not found in array items.\n\n` +
//             `Available fields: ${availableFields}\n\n` +
//             `Update your widget settings to use one of these fields.`
//           );
//         }

//         formatted = series
//           .map((item, index) => {
//             const dateValue = item[dateField];
//             const yValue = item[yField];
            
//             // Parse numeric value
//             let numericValue;
//             if (typeof yValue === 'string') {
//               numericValue = parseFloat(yValue);
//             } else {
//               numericValue = Number(yValue);
//             }
            
//             if (!dateValue || !Number.isFinite(numericValue)) {
//               if (DEBUG) console.warn(`Skipping item ${index}: date="${dateValue}" value="${yValue}"`);
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
//           `Series data must be an object or array.\n\n` +
//           `Got: ${typeof series}\n\n` +
//           `The selected path does not contain valid time-series data.`
//         );
//       }

//       if (formatted.length === 0) {
//         throw new Error(
//           `No valid data points found.\n\n` +
//           `Possible reasons:\n` +
//           `- Field "${yField}" doesn't contain numbers\n` +
//           `- Date field is missing or invalid\n` +
//           `- Data is in wrong format\n\n` +
//           `Check browser console for details.`
//         );
//       }

//       debugLog('✅ Success! Formatted', formatted.length, 'data points');
//       debugLog('Sample data:', formatted.slice(0, 3));
//       debugLog('========================');
      
//       setData(formatted);
//       setIsInitialLoad(false);
//     } catch (err) {
//       debugError('❌ Chart error:', err.message);
//       debugLog('========================');
//       setError(err.message || "Failed to load chart");
//       setData([]);
//       setIsInitialLoad(false);
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

//   // Skeleton loader
//   if (isInitialLoad && data.length === 0 && !error) {
//     return (
//       <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center gap-3">
//             <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
//             <div className="h-5 w-12 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
//           </div>
//           <div className="flex gap-2">
//             <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
//             <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
//             <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
//           </div>
//         </div>
//         <div className="h-72 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse"></div>
//       </div>
//     );
//   }

//   return (
//     <div 
//       {...dragListeners}
//       className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
//     >
//       {loading && !isInitialLoad && (
//         <div className="absolute top-2 right-2 z-10">
//           <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
//             <span className="inline-block w-2 h-2 bg-white rounded-full animate-ping"></span>
//             Updating
//           </div>
//         </div>
//       )}

//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-3">
//           <h3 className="font-semibold text-slate-900 dark:text-white">{name}</h3>
//           <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
//             {interval}s
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <button 
//             onClick={(e) => {
//               e.stopPropagation();
//               onEdit();
//             }}
//             className="text-slate-400 hover:text-slate-600 p-1 hover:scale-110 transition-transform cursor-pointer" 
//             title="Edit"
//           >
//             ⚙️
//           </button>
//           <button 
//             onClick={(e) => {
//               e.stopPropagation();
//               onDelete();
//             }}
//             className="text-red-500 hover:text-red-600 p-1 hover:scale-110 transition-transform cursor-pointer" 
//             title="Delete"
//           >
//             ✕
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">
//           <div className="font-semibold mb-2">⚠️ Chart Configuration Error</div>
//           <div className="text-xs mb-3 whitespace-pre-wrap font-mono">{error}</div>
//           <div className="flex gap-2">
//             <button 
//               onClick={onEdit} 
//               className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//             >
//               Fix Configuration
//             </button>
//             {DEBUG && (
//               <button 
//                 onClick={() => console.log('Full widget config:', widget)} 
//                 className="text-xs bg-slate-500 text-white px-3 py-1 rounded hover:bg-slate-600"
//               >
//                 Log Config
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {!error && data.length > 0 && (
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
//                   borderRadius: "8px" 
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
const DEBUG = process.env.NODE_ENV === "development";

function debugLog(...args) {
  if (DEBUG) console.log(...args);
}

function debugError(...args) {
  if (DEBUG) console.error(...args);
}

export default function ChartWidget({ widget, dragListeners, onEdit, onDelete }) {
  const { name, url, apiKey, apiKeyHeader, apiKeyPrefix, interval, seriesPath, yField } = widget;

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  async function loadData() {
    if (!seriesPath || !yField) {
      setError("Chart not configured. Click ⚙️ to set up.");
      setIsInitialLoad(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const json = await fetchApi(url, apiKey, apiKeyHeader, apiKeyPrefix);

      debugLog("=== CHART LOAD DEBUG ===");
      debugLog("Widget config:", { seriesPath, yField });
      debugLog("API Response:", json);

      const series = readPath(json, seriesPath);

      if (!series) {
        const errorMsg =
          json.Information || json.Error || json.error || json.message;
        if (errorMsg) {
          throw new Error(`API Error: ${errorMsg}`);
        }
        throw new Error(`Path "${seriesPath}" not found in API response.`);
      }

      let formatted = [];

      // Object with date keys
      if (typeof series === "object" && !Array.isArray(series)) {
        const entries = Object.entries(series);

        const [_, firstValues] = entries[0] || [];
        if (!firstValues || !(yField in firstValues)) {
          throw new Error(`Field "${yField}" not found in series data.`);
        }

        formatted = entries
          .map(([date, values]) => {
            const raw = values?.[yField];
            const num =
              typeof raw === "string" ? parseFloat(raw) : Number(raw);
            if (!Number.isFinite(num)) return null;
            return { date, value: num };
          })
          .filter(Boolean)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      // Array format
      else if (Array.isArray(series)) {
        const firstItem = series[0];
        const dateField =
          firstItem.date ||
          firstItem.time ||
          firstItem.timestamp ||
          Object.keys(firstItem)[0];

        if (!(yField in firstItem)) {
          throw new Error(`Field "${yField}" not found in array items.`);
        }

        formatted = series
          .map((item) => {
            const raw = item[yField];
            const num =
              typeof raw === "string" ? parseFloat(raw) : Number(raw);
            if (!item[dateField] || !Number.isFinite(num)) return null;
            return {
              date: String(item[dateField]),
              value: num,
            };
          })
          .filter(Boolean);
      } else {
        throw new Error("Series data must be an object or array.");
      }

      if (formatted.length === 0) {
        throw new Error("No valid data points found.");
      }

      setData(formatted);
      setIsInitialLoad(false);
    } catch (err) {
      debugError("❌ Chart error:", err.message);
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

  // Skeleton
  if (isInitialLoad && data.length === 0 && !error) {
    return (
      <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="h-72 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div
      {...dragListeners}
      className="relative w-full h-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing flex flex-col"
    >
      {loading && !isInitialLoad && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            Updating
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {name}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
            {interval}s
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* EDIT */}
          <button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={onEdit}
            className="text-slate-400 hover:text-slate-600 p-1 hover:scale-110 transition-transform"
            title="Edit"
          >
            ⚙️
          </button>

          {/* DELETE */}
          <button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 p-1 hover:scale-110 transition-transform"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded">
          <div className="font-semibold mb-2">⚠️ Chart Error</div>
          <div className="text-xs whitespace-pre-wrap font-mono mb-3">
            {error}
          </div>
          <button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={onEdit}
            className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Fix Configuration
          </button>
        </div>
      )}

      {/* Chart */}
      {!error && data.length > 0 && (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
              <Tooltip />
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