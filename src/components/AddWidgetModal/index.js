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
  const [fields, setFields] = useState([]);

  // Table
  const [arrayPath, setArrayPath] = useState("");

  // Chart
  const [seriesPath, setSeriesPath] = useState("");
  const [yField, setYField] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name);
      setUrl(initialData.url);
      setInterval(initialData.interval);
      setType(initialData.type);
      setFields(initialData.fields || []);
      setArrayPath(initialData.arrayPath || "");
      setSeriesPath(initialData.seriesPath || "");
      setYField(initialData.yField || "");
    }
  }, [mode, initialData]);

  async function testApi() {
    const result = await validateApi(url);
    setApiResult(result);
    setFields([]);
    setArrayPath("");
    setSeriesPath("");
    setYField("");
  }

  /** ===============================
   * CARD fields
   */
  const cardFields = useMemo(() => {
    if (!apiResult?.ok) return [];
    return Object.keys(apiResult.scalars).map((p) => ({
      path: p,
      label: p.replace(/\./g, " → "),
    }));
  }, [apiResult]);

  /** ===============================
   * TABLE columns
   */
  const tableColumns = useMemo(() => {
    if (!arrayPath || !apiResult?.arrays[arrayPath]) return [];
    const firstRow = apiResult.arrays[arrayPath][0];
    return Object.keys(firstRow);
  }, [arrayPath, apiResult]);

  /** ===============================
   * CHART y-fields
   */
  const chartFields = useMemo(() => {
    if (!seriesPath || !apiResult?.series[seriesPath]) return [];
    const first = Object.values(apiResult.series[seriesPath])[0];
    return Object.keys(first);
  }, [seriesPath, apiResult]);

  function handleSave() {
    onSave({
      id: crypto.randomUUID(),
      name,
      url,
      interval,
      type,
      fields,
      arrayPath,
      seriesPath,
      yField,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 space-y-6">

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
            fields={cardFields}
            selected={fields}
            onChange={setFields}
          />
        )}

        {/* TABLE */}
        {type === "table" && apiResult?.ok && (
          <>
            <select
              className="w-full border p-2"
              value={arrayPath}
              onChange={(e) => setArrayPath(e.target.value)}
            >
              <option value="">Select table source</option>
              {Object.keys(apiResult.arrays).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {arrayPath && (
              <FieldSelector
                fields={tableColumns.map((c) => ({ path: c, label: c }))}
                selected={fields}
                onChange={setFields}
              />
            )}
          </>
        )}

        {/* CHART */}
        {type === "chart" && apiResult?.ok && (
          <>
            <select
              className="w-full border p-2"
              value={seriesPath}
              onChange={(e) => setSeriesPath(e.target.value)}
            >
              <option value="">Select time series</option>
              {Object.keys(apiResult.series).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {seriesPath && (
              <select
                className="w-full border p-2"
                value={yField}
                onChange={(e) => setYField(e.target.value)}
              >
                <option value="">Select Y field</option>
                {chartFields.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            )}
          </>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            className="bg-emerald-500 text-white px-4 py-2 rounded"
            disabled={
              !name ||
              !url ||
              (type === "card" && fields.length === 0) ||
              (type === "table" && (!arrayPath || fields.length === 0)) ||
              (type === "chart" && (!seriesPath || !yField))
            }
            onClick={handleSave}
          >
            Add Widget
          </button>
        </div>
      </div>
    </div>
  );
}
