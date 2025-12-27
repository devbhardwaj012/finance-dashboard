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
