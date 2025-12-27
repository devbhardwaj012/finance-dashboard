// "use client";
// import { useEffect, useState } from "react";
// import { fetchApi } from "@/lib/api/fetchApi";
// import { readPath } from "@/lib/api/validateApi";

// export default function CardWidget({ widget, dragListeners, onDelete, onEdit }) {
//   const { name, url, interval, cardFields = [] } = widget;

//   const [rawData, setRawData] = useState(null);
//   const [error, setError] = useState(null);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [loading, setLoading] = useState(false);

//   async function loadData() {
//     try {
//       setLoading(true);
//       setError(null);

//       const json = await fetchApi(url);
//       setRawData(json);
//       setLastUpdated(new Date());
//     } catch (err) {
//       setError(err?.message || "Failed to refresh data");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadData();

//     if (!interval || interval <= 0) return;
//     const id = setInterval(loadData, interval * 1000);
//     return () => clearInterval(id);
//   }, [url, interval]);

//   function renderValue(value) {
//     if (value == null) return "—";

//     if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
//       return String(value);
//     }

//     return (
//       <pre className="text-xs whitespace-pre-wrap break-all opacity-80">
//         {JSON.stringify(value, null, 2)}
//       </pre>
//     );
//   }

//   return (
//     <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-3">
//           <h3 className="font-semibold text-slate-900 dark:text-white">
//             {name}
//           </h3>
//           <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
//             {interval}s
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             {...dragListeners}
//             className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
//             title="Drag to reorder"
//           >
//             ⠿
//           </button>
//           <button
//             onClick={() => onEdit(widget)}
//             className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
//             title="Edit widget"
//           >
//             ⚙️
//           </button>
//           <button
//             onClick={onDelete}
//             className="text-red-500 hover:text-red-600 p-1"
//             title="Delete widget"
//           >
//             ✕
//           </button>
//         </div>
//       </div>

//       <div className="space-y-2">
//         {loading && <div className="text-sm text-slate-400 animate-pulse">Refreshing…</div>}
//         {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}
//         {!rawData && !error && !loading && <div className="text-sm text-slate-400">Loading…</div>}
//         {rawData && cardFields.length === 0 && (
//           <div className="text-sm text-slate-400 text-center py-4">
//             No fields selected. Click ⚙️ to configure.
//           </div>
//         )}

//         {rawData && cardFields.map((fieldPath) => {
//           const value = readPath(rawData, fieldPath);

//           return (
//             <div
//               key={fieldPath}
//               className="flex justify-between gap-4 text-sm text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0"
//             >
//               <span className="truncate max-w-[55%] font-medium">
//                 {fieldPath.replace(/\./g, " → ")}
//               </span>
//               <span className="max-w-[45%] text-right">
//                 {renderValue(value)}
//               </span>
//             </div>
//           );
//         })}
//       </div>

//       {lastUpdated && (
//         <div className="mt-4 text-xs text-slate-400 text-right">
//           Updated: {lastUpdated.toLocaleTimeString()}
//         </div>
//       )}
//     </div>
//   );
// }







// just changed






















// "use client";
// import { useEffect, useState } from "react";
// import { fetchApi } from "@/lib/api/fetchApi";
// import { readPath } from "@/lib/api/validateApi";

// export default function CardWidget({ widget, dragListeners, onDelete, onEdit }) {
//   const { name, url, interval, cardFields = [] } = widget;

//   const [rawData, setRawData] = useState(null);
//   const [error, setError] = useState(null);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [loading, setLoading] = useState(false);

//   async function loadData() {
//     try {
//       setLoading(true);
//       setError(null);

//       const json = await fetchApi(url);
//       setRawData(json);
//       setLastUpdated(new Date());
//     } catch (err) {
//       setError(err?.message || "Failed to refresh data");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadData();

//     if (!interval || interval <= 0) return;
//     const id = setInterval(loadData, interval * 1000);
//     return () => clearInterval(id);
//   }, [url, interval]);

//   function renderValue(value) {
//     if (value == null || value === undefined) return "—";

//     // Handle different value types
//     if (typeof value === "string") {
//       return value;
//     }
    
//     if (typeof value === "number") {
//       return value.toLocaleString();
//     }
    
//     if (typeof value === "boolean") {
//       return value ? "Yes" : "No";
//     }

//     // For objects/arrays, show JSON
//     return (
//       <pre className="text-xs whitespace-pre-wrap break-all opacity-80">
//         {JSON.stringify(value, null, 2)}
//       </pre>
//     );
//   }

//   return (
//     <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between mb-3">
//         <div className="flex items-center gap-3">
//           <h3 className="font-semibold text-slate-900 dark:text-white">
//             {name}
//           </h3>
//           <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
//             {interval}s
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             {...dragListeners}
//             className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
//             title="Drag to reorder"
//           >
//             ⠿
//           </button>
//           <button
//             onClick={() => onEdit(widget)}
//             className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
//             title="Edit widget"
//           >
//             ⚙️
//           </button>
//           <button
//             onClick={onDelete}
//             className="text-red-500 hover:text-red-600 p-1"
//             title="Delete widget"
//           >
//             ✕
//           </button>
//         </div>
//       </div>

//       <div className="space-y-2">
//         {loading && <div className="text-sm text-slate-400 animate-pulse">Refreshing…</div>}
//         {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}
//         {!rawData && !error && !loading && <div className="text-sm text-slate-400">Loading…</div>}
//         {rawData && cardFields.length === 0 && (
//           <div className="text-sm text-slate-400 text-center py-4">
//             No fields selected. Click ⚙️ to configure.
//           </div>
//         )}

//         {rawData && cardFields.map((fieldPath) => {
//           const value = readPath(rawData, fieldPath);
          
//           // Debug: Log what we're trying to render
//           console.log('Rendering field:', fieldPath, 'Value:', value);

//           return (
//             <div
//               key={fieldPath}
//               className="flex justify-between gap-4 text-sm text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0"
//             >
//               <span className="truncate max-w-[55%] font-medium">
//                 {fieldPath.replace(/\./g, " → ")}
//               </span>
//               <span className="max-w-[45%] text-right">
//                 {renderValue(value)}
//               </span>
//             </div>
//           );
//         })}
//       </div>

//       {lastUpdated && (
//         <div className="mt-4 text-xs text-slate-400 text-right">
//           Updated: {lastUpdated.toLocaleTimeString()}
//         </div>
//       )}
//     </div>
//   );
// }
















"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api/fetchApi";
import { readPath } from "@/lib/api/validateApi";

export default function CardWidget({ widget, dragListeners, onDelete, onEdit }) {
  const { name, url, interval, cardFields = [] } = widget;

  const [rawData, setRawData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const json = await fetchApi(url);
      
      // Debug: Log the data structure
      if (process.env.NODE_ENV === 'development') {
        console.log('=== CARD WIDGET DEBUG ===');
        console.log('API Response:', json);
        console.log('Card fields:', cardFields);
        
        // Test each field path
        cardFields.forEach(fieldPath => {
          const value = readPath(json, fieldPath);
          console.log(`Path "${fieldPath}" → Value:`, value);
        });
        console.log('========================');
      }
      
      setRawData(json);
      setLastUpdated(new Date());
      setIsInitialLoad(false);
    } catch (err) {
      setError(err?.message || "Failed to refresh data");
      setIsInitialLoad(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    if (!interval || interval <= 0) return;
    const id = setInterval(loadData, interval * 1000);
    return () => clearInterval(id);
  }, [url, interval]);

  function formatNumber(num) {
    // Handle very large numbers (> 1 trillion) with scientific notation
    if (Math.abs(num) >= 1e12) {
      return num.toExponential(2);
    }
    
    // Handle large numbers with K/M/B suffixes for readability
    if (Math.abs(num) >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    }
    if (Math.abs(num) >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    }
    if (Math.abs(num) >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
    }
    
    // Small numbers - show up to 8 decimals for crypto rates
    if (Math.abs(num) < 1 && num !== 0) {
      // For very small numbers (like 0.00000123), use scientific notation
      if (Math.abs(num) < 0.000001) {
        return num.toExponential(2);
      }
      return num.toFixed(8).replace(/\.?0+$/, ''); // Remove trailing zeros
    }
    
    // Regular numbers with up to 2 decimals
    return num.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    });
  }

  function renderValue(value) {
    if (value == null || value === undefined) return "—";
    
    // Handle numbers
    if (typeof value === "number") {
      const formatted = formatNumber(value);
      return (
        <span 
          className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded" 
          title={`Exact: ${value.toLocaleString(undefined, { maximumFractionDigits: 20 })}`}
        >
          {formatted}
        </span>
      );
    }
    
    // Handle strings
    if (typeof value === "string") {
      // Check if string is a large number
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && value.trim() === numValue.toString()) {
        const formatted = formatNumber(numValue);
        return (
          <span 
            className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded" 
            title={`Exact: ${value}`}
          >
            {formatted}
          </span>
        );
      }
      
      // Regular string - truncate if too long
      if (value.length > 50) {
        return (
          <span className="truncate block" title={value}>
            {value}
          </span>
        );
      }
      return value;
    }
    
    // Handle booleans
    if (typeof value === "boolean") {
      return (
        <span className={value ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
          {value ? "✓ Yes" : "✗ No"}
        </span>
      );
    }
    
    // Handle objects/arrays
    if (typeof value === "object") {
      const jsonStr = JSON.stringify(value, null, 2);
      if (jsonStr.length > 100) {
        return (
          <details className="cursor-pointer">
            <summary className="text-xs text-blue-500 hover:text-blue-600">
              View JSON
            </summary>
            <pre className="text-xs whitespace-pre-wrap break-all opacity-80 mt-1 p-2 bg-slate-50 dark:bg-slate-800 rounded">
              {jsonStr}
            </pre>
          </details>
        );
      }
      return (
        <pre className="text-xs whitespace-pre-wrap break-all opacity-80">
          {jsonStr}
        </pre>
      );
    }
    
    return String(value);
  }

  // Skeleton loader for initial load
  if (isInitialLoad && !rawData && !error) {
    return (
      <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
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
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between gap-4">
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
              <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Loading overlay for refresh (non-intrusive) */}
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
          <button {...dragListeners} className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1" title="Drag">⠿</button>
          <button onClick={onEdit} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:scale-110 transition-transform" title="Edit">⚙️</button>
          <button onClick={onDelete} className="text-red-500 hover:text-red-600 p-1 hover:scale-110 transition-transform" title="Delete">✕</button>
        </div>
      </div>

      <div className="space-y-2">
        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {error}
          </div>
        )}

        {rawData && cardFields.length === 0 && (
          <div className="text-sm text-slate-400 text-center py-4">
            No fields selected. Click ⚙️ to configure.
          </div>
        )}

        {rawData && cardFields.map((fieldPath) => {
          const value = readPath(rawData, fieldPath);
          
          // Format the field label (remove "Meta Data." prefix for cleaner display)
          let displayLabel = fieldPath.replace(/\./g, " → ");
          
          // If path starts with object name, show cleaner version
          const parts = fieldPath.split('.');
          if (parts.length > 1 && parts[0] === 'Meta Data') {
            // "Meta Data.1.Information" → "1. Information"
            displayLabel = parts.slice(1).join(' → ');
          }
          
          return (
            <div
              key={fieldPath}
              className="flex justify-between items-start gap-4 text-sm text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0"
            >
              <span className="font-medium flex-shrink-0 min-w-0" title={fieldPath}>
                <span className="block truncate">
                  {displayLabel}
                </span>
              </span>
              <span className="text-right flex-shrink min-w-0 break-all">
                {renderValue(value)}
              </span>
            </div>
          );
        })}
      </div>

      {lastUpdated && (
        <div className="mt-4 text-xs text-slate-400 text-right">
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}