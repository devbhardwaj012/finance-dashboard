// "use client";
// import { useEffect, useMemo, useState } from "react";
// import { validateApi } from "@/lib/api/validateApi";
// import ApiTester from "./ApiTester";
// import FieldSelector from "./FieldSelector";
// import WidgetTypeSelector from "./WidgetTypeSelector";

// export default function AddWidgetModal({
//   mode = "create",
//   initialData = null,
//   onClose,
//   onSave,
// }) {
//   const [name, setName] = useState("");
//   const [url, setUrl] = useState("");
//   const [interval, setInterval] = useState(30);
//   const [type, setType] = useState("card");
//   const [apiResult, setApiResult] = useState(null);

//   // CARD
//   const [cardFields, setCardFields] = useState([]);

//   // TABLE
//   const [arrayPath, setArrayPath] = useState("");
//   const [tableFields, setTableFields] = useState([]);

//   // CHART
//   const [seriesPath, setSeriesPath] = useState("");
//   const [yField, setYField] = useState("");

//   /* Prefill for edit mode */
//   useEffect(() => {
//     if (mode === "edit" && initialData) {
//       setName(initialData.name);
//       setUrl(initialData.url);
//       setInterval(initialData.interval);
//       setType(initialData.type);

//       setCardFields(initialData.cardFields || []);
//       setArrayPath(initialData.arrayPath || "");
//       setTableFields(initialData.tableFields || []);
//       setSeriesPath(initialData.seriesPath || "");
//       setYField(initialData.yField || "");

//       // Auto-test API in edit mode
//       if (initialData.url) {
//         validateApi(initialData.url).then(setApiResult);
//       }
//     }
//   }, [mode, initialData]);

//   /* Reset fields when type changes */
//   useEffect(() => {
//     setCardFields([]);
//     setArrayPath("");
//     setTableFields([]);
//     setSeriesPath("");
//     setYField("");
//   }, [type]);

//   /* Test API */
//   async function testApi() {
//     const result = await validateApi(url);
//     setApiResult(result);

//     // Reset selections
//     setCardFields([]);
//     setArrayPath("");
//     setTableFields([]);
//     setSeriesPath("");
//     setYField("");
//   }

//   /* Derived options */
//   const scalarOptions = useMemo(() => {
//     if (!apiResult?.ok) return [];
//     return Object.keys(apiResult.scalars).map((p) => ({
//       path: p,
//       label: p.replace(/\./g, " → "),
//     }));
//   }, [apiResult]);

//   const tableColumns = useMemo(() => {
//     if (!arrayPath || !apiResult?.arrays[arrayPath]) return [];
//     const firstRow = apiResult.arrays[arrayPath][0] || {};
//     return Object.keys(firstRow).map((k) => ({
//       path: k,
//       label: k,
//     }));
//   }, [arrayPath, apiResult]);

//   const chartYFields = useMemo(() => {
//     if (!seriesPath || !apiResult?.series[seriesPath]) return [];
//     const seriesData = apiResult.series[seriesPath];
//     const dates = Object.keys(seriesData);
//     if (!dates.length) return [];
//     const firstPoint = seriesData[dates[0]] || {};
//     return Object.keys(firstPoint);
//   }, [seriesPath, apiResult]);

//   /* Save */
//   function handleSave() {
//     const widget = {
//       id: initialData?.id ?? crypto.randomUUID(),
//       name,
//       url,
//       interval,
//       type,
//     };

//     if (type === "card") {
//       widget.cardFields = cardFields;
//     }

//     if (type === "table") {
//       widget.arrayPath = arrayPath;
//       widget.tableFields = tableFields;
//     }

//     if (type === "chart") {
//       widget.seriesPath = seriesPath;
//       widget.yField = yField;
//     }

//     onSave(widget);
//   }

//   /* Validation */
//   const canSave =
//     name &&
//     url &&
//     apiResult?.ok &&
//     ((type === "card" && cardFields.length > 0) ||
//       (type === "table" && arrayPath && tableFields.length > 0) ||
//       (type === "chart" && seriesPath && yField));

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//       <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
//           <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
//             {mode === "edit" ? "Edit Widget" : "Add New Widget"}
//           </h2>
//         </div>

//         {/* Scrollable content */}
//         <div className="p-6 space-y-6 overflow-y-auto">
//           <ApiTester
//             name={name}
//             setName={setName}
//             url={url}
//             setUrl={setUrl}
//             interval={interval}
//             setInterval={setInterval}
//             onTest={testApi}
//             apiResult={apiResult}
//           />

//           {apiResult?.ok && <WidgetTypeSelector value={type} onChange={setType} />}

//           {/* CARD */}
//           {type === "card" && apiResult?.ok && (
//             <FieldSelector
//               fields={scalarOptions}
//               selected={cardFields}
//               onChange={setCardFields}
//             />
//           )}

//           {/* TABLE */}
//           {type === "table" && apiResult?.ok && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
//                   Table Data Source
//                 </label>
//                 <select
//                   className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
//                   value={arrayPath}
//                   onChange={(e) => setArrayPath(e.target.value)}
//                 >
//                   <option value="">Select table source...</option>
//                   {Object.keys(apiResult.arrays).map((p) => (
//                     <option key={p} value={p}>
//                       {p} ({apiResult.arrays[p].length} rows)
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {arrayPath && (
//                 <FieldSelector
//                   fields={tableColumns}
//                   selected={tableFields}
//                   onChange={setTableFields}
//                 />
//               )}
//             </>
//           )}

//           {/* CHART */}
//           {type === "chart" && apiResult?.ok && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
//                   Time Series Data
//                 </label>
//                 <select
//                   className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
//                   value={seriesPath}
//                   onChange={(e) => setSeriesPath(e.target.value)}
//                 >
//                   <option value="">Select time series...</option>
//                   {Object.keys(apiResult.series).map((p) => (
//                     <option key={p} value={p}>
//                       {p} ({Object.keys(apiResult.series[p]).length} points)
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {seriesPath && (
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
//                     Y-Axis Field
//                   </label>
//                   <select
//                     className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
//                     value={yField}
//                     onChange={(e) => setYField(e.target.value)}
//                   >
//                     <option value="">Select Y field...</option>
//                     {chartYFields.map((f) => (
//                       <option key={f} value={f}>
//                         {f}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!canSave}
//             className="bg-emerald-500 text-white px-6 py-2 rounded-md font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
//           >
//             {mode === "edit" ? "Save Changes" : "Add Widget"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




























// "use client";
// import { useEffect, useMemo, useState } from "react";
// import { validateApi } from "@/lib/api/validateApi";
// import ApiTester from "./ApiTester";
// import FieldSelector from "./FieldSelector";
// import WidgetTypeSelector from "./WidgetTypeSelector";

// export default function AddWidgetModal({
//   mode = "create",
//   initialData = null,
//   onClose,
//   onSave,
// }) {
//   const [name, setName] = useState("");
//   const [url, setUrl] = useState("");
//   const [interval, setInterval] = useState(30);
//   const [type, setType] = useState("card");
//   const [apiResult, setApiResult] = useState(null);

//   // CARD
//   const [cardFields, setCardFields] = useState([]);

//   // TABLE
//   const [arrayPath, setArrayPath] = useState("");
//   const [tableFields, setTableFields] = useState([]);

//   // CHART
//   const [seriesPath, setSeriesPath] = useState("");
//   const [yField, setYField] = useState("");

//   /* Prefill for edit mode */
//   useEffect(() => {
//     if (mode === "edit" && initialData) {
//       setName(initialData.name);
//       setUrl(initialData.url);
//       setInterval(initialData.interval);
//       setType(initialData.type);

//       setCardFields(initialData.cardFields || []);
//       setArrayPath(initialData.arrayPath || "");
//       setTableFields(initialData.tableFields || []);
//       setSeriesPath(initialData.seriesPath || "");
//       setYField(initialData.yField || "");

//       // Auto-test API in edit mode
//       if (initialData.url) {
//         validateApi(initialData.url).then(setApiResult);
//       }
//     }
//   }, [mode, initialData]);

//   /* Reset fields when type changes */
//   useEffect(() => {
//     setCardFields([]);
//     setArrayPath("");
//     setTableFields([]);
//     setSeriesPath("");
//     setYField("");
//   }, [type]);

//   /* Test API */
//   async function testApi() {
//     const result = await validateApi(url);
//     setApiResult(result);

//     // Reset selections
//     setCardFields([]);
//     setArrayPath("");
//     setTableFields([]);
//     setSeriesPath("");
//     setYField("");
//   }

//   /* Derived options */
//   const scalarOptions = useMemo(() => {
//     if (!apiResult?.ok) return [];
//     return Object.keys(apiResult.scalars).map((p) => ({
//       path: p,
//       label: p.replace(/\./g, " → "),
//     }));
//   }, [apiResult]);

//   const tableColumns = useMemo(() => {
//     if (!arrayPath || !apiResult?.arrays[arrayPath]) return [];
//     const firstRow = apiResult.arrays[arrayPath][0] || {};
//     return Object.keys(firstRow).map((k) => ({
//       path: k,
//       label: k,
//     }));
//   }, [arrayPath, apiResult]);

//   const chartYFields = useMemo(() => {
//     if (!seriesPath || !apiResult?.series[seriesPath]) return [];
//     const seriesData = apiResult.series[seriesPath];
//     const dates = Object.keys(seriesData);
//     if (!dates.length) return [];
//     const firstPoint = seriesData[dates[0]] || {};
//     return Object.keys(firstPoint);
//   }, [seriesPath, apiResult]);

//   /* Check API compatibility with widget types */
//   const compatibility = useMemo(() => {
//     if (!apiResult?.ok) return { card: true, table: true, chart: true };
    
//     const hasScalars = Object.keys(apiResult.scalars).length > 0;
//     const hasArrays = Object.keys(apiResult.arrays).length > 0;
//     const hasSeries = Object.keys(apiResult.series).length > 0;
    
//     return {
//       card: hasScalars,
//       table: hasArrays,
//       chart: hasSeries,
//     };
//   }, [apiResult]);

//   /* Save */
//   function handleSave() {
//     const widget = {
//       id: initialData?.id ?? crypto.randomUUID(),
//       name,
//       url,
//       interval,
//       type,
//     };

//     if (type === "card") {
//       widget.cardFields = cardFields;
//     }

//     if (type === "table") {
//       widget.arrayPath = arrayPath;
//       widget.tableFields = tableFields;
//     }

//     if (type === "chart") {
//       widget.seriesPath = seriesPath;
//       widget.yField = yField;
//     }

//     onSave(widget);
//   }

//   /* Validation */
//   const canSave =
//     name &&
//     url &&
//     apiResult?.ok &&
//     ((type === "card" && cardFields.length > 0) ||
//       (type === "table" && arrayPath && tableFields.length > 0) ||
//       (type === "chart" && seriesPath && yField));

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//       <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
//           <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
//             {mode === "edit" ? "Edit Widget" : "Add New Widget"}
//           </h2>
//         </div>

//         {/* Scrollable content */}
//         <div className="p-6 space-y-6 overflow-y-auto">
//           <ApiTester
//             name={name}
//             setName={setName}
//             url={url}
//             setUrl={setUrl}
//             interval={interval}
//             setInterval={setInterval}
//             onTest={testApi}
//             apiResult={apiResult}
//           />

//           {apiResult?.ok && <WidgetTypeSelector value={type} onChange={setType} />}

//           {/* API Compatibility Warning */}
//           {apiResult?.ok && !compatibility[type] && (
//             <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
//               <div className="flex items-start gap-3">
//                 <span className="text-2xl">⚠️</span>
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
//                     API Not Compatible with {type.charAt(0).toUpperCase() + type.slice(1)} Widget
//                   </h3>
//                   <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
//                     {type === "card" && "This API doesn't provide any scalar values (simple key-value pairs). Card widgets need individual data fields."}
//                     {type === "table" && "This API doesn't provide any array data. Table widgets need a list of items to display in rows."}
//                     {type === "chart" && "This API doesn't provide time-series data. Chart widgets need data points with timestamps to plot over time."}
//                   </p>
//                   <div className="text-sm text-amber-800 dark:text-amber-200">
//                     <p className="font-medium mb-1">Try instead:</p>
//                     <ul className="list-disc ml-5 space-y-1">
//                       {compatibility.card && type !== "card" && (
//                         <li>Switch to <strong>Card</strong> widget to display individual values</li>
//                       )}
//                       {compatibility.table && type !== "table" && (
//                         <li>Switch to <strong>Table</strong> widget to display list data</li>
//                       )}
//                       {compatibility.chart && type !== "chart" && (
//                         <li>Switch to <strong>Chart</strong> widget to visualize trends</li>
//                       )}
//                       {!compatibility.card && !compatibility.table && !compatibility.chart && (
//                         <li>Use a different API that provides the data format you need</li>
//                       )}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* CARD */}
//           {type === "card" && apiResult?.ok && compatibility.card && (
//             <FieldSelector
//               fields={scalarOptions}
//               selected={cardFields}
//               onChange={setCardFields}
//             />
//           )}

//           {/* TABLE */}
//           {type === "table" && apiResult?.ok && compatibility.table && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
//                   Table Data Source
//                 </label>
//                 <select
//                   className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
//                   value={arrayPath}
//                   onChange={(e) => setArrayPath(e.target.value)}
//                 >
//                   <option value="">Select table source...</option>
//                   {Object.keys(apiResult.arrays).map((p) => (
//                     <option key={p} value={p}>
//                       {p} ({apiResult.arrays[p].length} rows)
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {arrayPath && (
//                 <FieldSelector
//                   fields={tableColumns}
//                   selected={tableFields}
//                   onChange={setTableFields}
//                 />
//               )}
//             </>
//           )}

//           {/* CHART */}
//           {type === "chart" && apiResult?.ok && compatibility.chart && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
//                   Time Series Data
//                 </label>
//                 <select
//                   className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
//                   value={seriesPath}
//                   onChange={(e) => setSeriesPath(e.target.value)}
//                 >
//                   <option value="">Select time series...</option>
//                   {Object.keys(apiResult.series).map((p) => (
//                     <option key={p} value={p}>
//                       {p} ({Object.keys(apiResult.series[p]).length} points)
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {seriesPath && (
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
//                     Y-Axis Field
//                   </label>
//                   <select
//                     className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
//                     value={yField}
//                     onChange={(e) => setYField(e.target.value)}
//                   >
//                     <option value="">Select Y field...</option>
//                     {chartYFields.map((f) => (
//                       <option key={f} value={f}>
//                         {f}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}
//             </>
//           )}

//           {/* No data available for any widget type */}
//           {apiResult?.ok && !compatibility.card && !compatibility.table && !compatibility.chart && (
//             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
//               <div className="flex items-start gap-3">
//                 <span className="text-2xl">❌</span>
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
//                     API Cannot Be Used for Widgets
//                   </h3>
//                   <p className="text-sm text-red-800 dark:text-red-200">
//                     This API response doesn't contain data in a format that any widget type can display. 
//                     The API may have returned an error, empty data, or an unsupported structure.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!canSave}
//             className="bg-emerald-500 text-white px-6 py-2 rounded-md font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
//           >
//             {mode === "edit" ? "Save Changes" : "Add Widget"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


















































"use client";
import { useEffect, useMemo, useState } from "react";
import { validateApi } from "@/lib/api/validateApi";
import ApiTester from "./ApiTester";
import FieldSelector from "./FieldSelector";
import WidgetTypeSelector from "./WidgetTypeSelector";

export default function AddWidgetModal({
  mode = "create",
  initialData = null,
  onClose,
  onSave,
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(30);
  const [type, setType] = useState("card");
  const [apiResult, setApiResult] = useState(null);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // CARD
  const [cardFields, setCardFields] = useState([]);

  // TABLE
  const [arrayPath, setArrayPath] = useState("");
  const [tableFields, setTableFields] = useState([]);

  // CHART
  const [seriesPath, setSeriesPath] = useState("");
  const [yField, setYField] = useState("");

  /* Prefill for edit mode */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name);
      setUrl(initialData.url);
      setInterval(initialData.interval);
      setType(initialData.type);

      setCardFields(initialData.cardFields || []);
      setArrayPath(initialData.arrayPath || "");
      setTableFields(initialData.tableFields || []);
      setSeriesPath(initialData.seriesPath || "");
      setYField(initialData.yField || "");

      // Auto-test API in edit mode
      if (initialData.url) {
        validateApi(initialData.url).then(setApiResult);
      }
    }
  }, [mode, initialData]);

  /* Reset fields when type changes */
  useEffect(() => {
    setCardFields([]);
    setArrayPath("");
    setTableFields([]);
    setSeriesPath("");
    setYField("");
    setSearchTerm(""); // Reset search on type change
  }, [type]);

  /* Test API */
  async function testApi() {
    const result = await validateApi(url);
    setApiResult(result);

    // Reset selections
    setCardFields([]);
    setArrayPath("");
    setTableFields([]);
    setSeriesPath("");
    setYField("");
    setSearchTerm("");
  }

  /* Derived options */
  const scalarOptions = useMemo(() => {
    if (!apiResult?.ok) return [];
    return Object.keys(apiResult.scalars).map((p) => ({
      path: p,
      label: p.replace(/\./g, " → "),
    }));
  }, [apiResult]);

  const tableColumns = useMemo(() => {
    if (!arrayPath || !apiResult?.arrays[arrayPath]) return [];
    const firstRow = apiResult.arrays[arrayPath][0] || {};
    return Object.keys(firstRow).map((k) => ({
      path: k,
      label: k,
    }));
  }, [arrayPath, apiResult]);

  const chartYFields = useMemo(() => {
    if (!seriesPath || !apiResult?.series[seriesPath]) return [];
    const seriesData = apiResult.series[seriesPath];
    const dates = Object.keys(seriesData);
    if (!dates.length) return [];
    const firstPoint = seriesData[dates[0]] || {};
    return Object.keys(firstPoint);
  }, [seriesPath, apiResult]);

  /* Filtered Options based on Search Term */
  const filteredScalarOptions = useMemo(() => {
    if (!searchTerm) return scalarOptions;
    return scalarOptions.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
      opt.path.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [scalarOptions, searchTerm]);

  const filteredTableColumns = useMemo(() => {
    if (!searchTerm) return tableColumns;
    return tableColumns.filter(opt => 
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
      opt.path.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tableColumns, searchTerm]);

  /* Check API compatibility with widget types */
  const compatibility = useMemo(() => {
    if (!apiResult?.ok) return { card: true, table: true, chart: true };
    
    const hasScalars = Object.keys(apiResult.scalars).length > 0;
    const hasArrays = Object.keys(apiResult.arrays).length > 0;
    const hasSeries = Object.keys(apiResult.series).length > 0;
    
    return {
      card: hasScalars,
      table: hasArrays,
      chart: hasSeries,
    };
  }, [apiResult]);

  /* Save */
  function handleSave() {
    const widget = {
      id: initialData?.id ?? crypto.randomUUID(),
      name,
      url,
      interval,
      type,
    };

    if (type === "card") {
      widget.cardFields = cardFields;
    }

    if (type === "table") {
      widget.arrayPath = arrayPath;
      widget.tableFields = tableFields;
    }

    if (type === "chart") {
      widget.seriesPath = seriesPath;
      widget.yField = yField;
    }

    onSave(widget);
  }

  /* Validation */
  const canSave =
    name &&
    url &&
    apiResult?.ok &&
    ((type === "card" && cardFields.length > 0) ||
      (type === "table" && arrayPath && tableFields.length > 0) ||
      (type === "chart" && seriesPath && yField));

  /* Reusable Search Input UI */
  const SearchInput = () => (
    <div className="relative mb-2">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search fields..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none placeholder-slate-400"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {mode === "edit" ? "Edit Widget" : "Add New Widget"}
          </h2>
        </div>

        {/* Scrollable content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <ApiTester
            name={name}
            setName={setName}
            url={url}
            setUrl={setUrl}
            interval={interval}
            setInterval={setInterval}
            onTest={testApi}
            apiResult={apiResult}
          />

          {apiResult?.ok && <WidgetTypeSelector value={type} onChange={setType} />}

          {/* API Compatibility Warning */}
          {apiResult?.ok && !compatibility[type] && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                    API Not Compatible with {type.charAt(0).toUpperCase() + type.slice(1)} Widget
                  </h3>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                    {type === "card" && "This API doesn't provide any scalar values (simple key-value pairs). Card widgets need individual data fields."}
                    {type === "table" && "This API doesn't provide any array data. Table widgets need a list of items to display in rows."}
                    {type === "chart" && "This API doesn't provide time-series data. Chart widgets need data points with timestamps to plot over time."}
                  </p>
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-medium mb-1">Try instead:</p>
                    <ul className="list-disc ml-5 space-y-1">
                      {compatibility.card && type !== "card" && (
                        <li>Switch to <strong>Card</strong> widget to display individual values</li>
                      )}
                      {compatibility.table && type !== "table" && (
                        <li>Switch to <strong>Table</strong> widget to display list data</li>
                      )}
                      {compatibility.chart && type !== "chart" && (
                        <li>Switch to <strong>Chart</strong> widget to visualize trends</li>
                      )}
                      {!compatibility.card && !compatibility.table && !compatibility.chart && (
                        <li>Use a different API that provides the data format you need</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CARD */}
          {type === "card" && apiResult?.ok && compatibility.card && (
            <div>
              <SearchInput />
              <FieldSelector
                fields={filteredScalarOptions}
                selected={cardFields}
                onChange={setCardFields}
              />
              <p className="text-xs text-slate-500 mt-2 text-right">
                Showing {filteredScalarOptions.length} of {scalarOptions.length} fields
              </p>
            </div>
          )}

          {/* TABLE */}
          {type === "table" && apiResult?.ok && compatibility.table && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Table Data Source
                </label>
                <select
                  className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={arrayPath}
                  onChange={(e) => setArrayPath(e.target.value)}
                >
                  <option value="">Select table source...</option>
                  {Object.keys(apiResult.arrays).map((p) => (
                    <option key={p} value={p}>
                      {p} ({apiResult.arrays[p].length} rows)
                    </option>
                  ))}
                </select>
              </div>

              {arrayPath && (
                <div>
                  <SearchInput />
                  <FieldSelector
                    fields={filteredTableColumns}
                    selected={tableFields}
                    onChange={setTableFields}
                  />
                  <p className="text-xs text-slate-500 mt-2 text-right">
                    Showing {filteredTableColumns.length} of {tableColumns.length} fields
                  </p>
                </div>
              )}
            </>
          )}

          {/* CHART */}
          {type === "chart" && apiResult?.ok && compatibility.chart && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Time Series Data
                </label>
                <select
                  className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={seriesPath}
                  onChange={(e) => setSeriesPath(e.target.value)}
                >
                  <option value="">Select time series...</option>
                  {Object.keys(apiResult.series).map((p) => (
                    <option key={p} value={p}>
                      {p} ({Object.keys(apiResult.series[p]).length} points)
                    </option>
                  ))}
                </select>
              </div>

              {seriesPath && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Y-Axis Field
                  </label>
                  <select
                    className="w-full border border-slate-300 dark:border-slate-700 p-2 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={yField}
                    onChange={(e) => setYField(e.target.value)}
                  >
                    <option value="">Select Y field...</option>
                    {chartYFields.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {/* No data available for any widget type */}
          {apiResult?.ok && !compatibility.card && !compatibility.table && !compatibility.chart && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                    API Cannot Be Used for Widgets
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-200">
                    This API response doesn't contain data in a format that any widget type can display. 
                    The API may have returned an error, empty data, or an unsupported structure.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="bg-emerald-500 text-white px-6 py-2 rounded-md font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {mode === "edit" ? "Save Changes" : "Add Widget"}
          </button>
        </div>
      </div>
    </div>
  );
}