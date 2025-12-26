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

//   /* ===============================
//      Prefill (edit mode)
//      =============================== */
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
//     }
//   }, [mode, initialData]);

//   /* ===============================
//      Reset when type changes
//      =============================== */
//   useEffect(() => {
//     setCardFields([]);
//     setArrayPath("");
//     setTableFields([]);
//     setSeriesPath("");
//     setYField("");
//   }, [type]);

//   /* ===============================
//      Test API
//      =============================== */
//   async function testApi() {
//     const result = await validateApi(url);
//     setApiResult(result);

//     setCardFields([]);
//     setArrayPath("");
//     setTableFields([]);
//     setSeriesPath("");
//     setYField("");
//   }

//   /* ===============================
//      Derived options
//      =============================== */
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
//     const firstPoint = Object.values(apiResult.series[seriesPath])[0] || {};
//     return Object.keys(firstPoint);
//   }, [seriesPath, apiResult]);

//   /* ===============================
//      Save
//      =============================== */
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

//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//       <div className="bg-white rounded-xl w-full max-w-3xl p-6 space-y-6">

//         <ApiTester
//           name={name}
//           setName={setName}
//           url={url}
//           setUrl={setUrl}
//           interval={interval}
//           setInterval={setInterval}
//           onTest={testApi}
//           apiResult={apiResult}
//         />

//         <WidgetTypeSelector value={type} onChange={setType} />

//         {/* ===============================
//            CARD
//            =============================== */}
//         {type === "card" && apiResult?.ok && (
//           <FieldSelector
//             fields={scalarOptions}
//             selected={cardFields}
//             onChange={setCardFields}
//           />
//         )}

//         {/* ===============================
//            TABLE
//            =============================== */}
//         {type === "table" && apiResult?.ok && (
//           <>
//             <select
//               className="w-full border p-2 rounded"
//               value={arrayPath}
//               onChange={(e) => setArrayPath(e.target.value)}
//             >
//               <option value="">Select table source</option>
//               {Object.keys(apiResult.arrays).map((p) => (
//                 <option key={p} value={p}>{p}</option>
//               ))}
//             </select>

//             {arrayPath && (
//               <FieldSelector
//                 fields={tableColumns}
//                 selected={tableFields}
//                 onChange={setTableFields}
//               />
//             )}
//           </>
//         )}

//         {/* ===============================
//            CHART
//            =============================== */}
//         {type === "chart" && apiResult?.ok && (
//           <>
//             <select
//               className="w-full border p-2 rounded"
//               value={seriesPath}
//               onChange={(e) => setSeriesPath(e.target.value)}
//             >
//               <option value="">Select time series</option>
//               {Object.keys(apiResult.series).map((p) => (
//                 <option key={p} value={p}>{p}</option>
//               ))}
//             </select>

//             {seriesPath && (
//               <select
//                 className="w-full border p-2 rounded"
//                 value={yField}
//                 onChange={(e) => setYField(e.target.value)}
//               >
//                 <option value="">Select Y field</option>
//                 {chartYFields.map((f) => (
//                   <option key={f} value={f}>{f}</option>
//                 ))}
//               </select>
//             )}
//           </>
//         )}

//         <div className="flex justify-end gap-3">
//           <button onClick={onClose}>Cancel</button>
//           <button
//             className="bg-emerald-500 text-white px-4 py-2 rounded disabled:opacity-50"
//             disabled={
//               !name ||
//               !url ||
//               (type === "card" && cardFields.length === 0) ||
//               (type === "table" && (!arrayPath || tableFields.length === 0)) ||
//               (type === "chart" && (!seriesPath || !yField))
//             }
//             onClick={handleSave}
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

  // CARD
  const [cardFields, setCardFields] = useState([]);

  // TABLE
  const [arrayPath, setArrayPath] = useState("");
  const [tableFields, setTableFields] = useState([]);

  // CHART
  const [seriesPath, setSeriesPath] = useState("");
  const [yField, setYField] = useState("");

  /* ===============================
     Prefill (edit mode)
     =============================== */
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
    }
  }, [mode, initialData]);

  /* ===============================
     Reset when type changes
     =============================== */
  useEffect(() => {
    setCardFields([]);
    setArrayPath("");
    setTableFields([]);
    setSeriesPath("");
    setYField("");
  }, [type]);

  /* ===============================
     Test API
     =============================== */
  async function testApi() {
    const result = await validateApi(url);
    setApiResult(result);

    setCardFields([]);
    setArrayPath("");
    setTableFields([]);
    setSeriesPath("");
    setYField("");
  }

  /* ===============================
     Derived options
     =============================== */
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
    const firstPoint = Object.values(apiResult.series[seriesPath])[0] || {};
    return Object.keys(firstPoint);
  }, [seriesPath, apiResult]);

  /* ===============================
     Save
     =============================== */
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

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div
        className="
          bg-white dark:bg-slate-900
          rounded-xl w-full max-w-3xl
          max-h-[80vh]
          flex flex-col
        "
      >
        {/* ===============================
           Scrollable content
           =============================== */}
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

          <WidgetTypeSelector value={type} onChange={setType} />

          {/* CARD */}
          {type === "card" && apiResult?.ok && (
            <FieldSelector
              fields={scalarOptions}
              selected={cardFields}
              onChange={setCardFields}
            />
          )}

          {/* TABLE */}
          {type === "table" && apiResult?.ok && (
            <>
              <select
                className="w-full border p-2 rounded"
                value={arrayPath}
                onChange={(e) => setArrayPath(e.target.value)}
              >
                <option value="">Select table source</option>
                {Object.keys(apiResult.arrays).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {arrayPath && (
                <FieldSelector
                  fields={tableColumns}
                  selected={tableFields}
                  onChange={setTableFields}
                />
              )}
            </>
          )}

          {/* CHART */}
          {type === "chart" && apiResult?.ok && (
            <>
              <select
                className="w-full border p-2 rounded"
                value={seriesPath}
                onChange={(e) => setSeriesPath(e.target.value)}
              >
                <option value="">Select time series</option>
                {Object.keys(apiResult.series).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {seriesPath && (
                <select
                  className="w-full border p-2 rounded"
                  value={yField}
                  onChange={(e) => setYField(e.target.value)}
                >
                  <option value="">Select Y field</option>
                  {chartYFields.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>

        {/* ===============================
           Footer (fixed)
           =============================== */}
        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            className="bg-emerald-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={
              !name ||
              !url ||
              (type === "card" && cardFields.length === 0) ||
              (type === "table" &&
                (!arrayPath || tableFields.length === 0)) ||
              (type === "chart" && (!seriesPath || !yField))
            }
            onClick={handleSave}
          >
            {mode === "edit" ? "Save Changes" : "Add Widget"}
          </button>
        </div>
      </div>
    </div>
  );
}

