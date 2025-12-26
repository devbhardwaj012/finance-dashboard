"use client";

import { useEffect, useState } from "react";
import { validateApi } from "@/lib/api/validateApi";

import ApiTester from "./ApiTester";
import FieldSelector from "./FieldSelector";
import WidgetTypeSelector from "./WidgetTypeSelector";

export default function AddWidgetModal({
  mode = "create",          // "create" | "edit"
  initialData = null,       // widget when editing
  onClose,
  onSave,
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(30);
  const [type, setType] = useState("card");
  const [apiResult, setApiResult] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);

  /* ===============================
     🔁 Prefill when editing
     =============================== */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name);
      setUrl(initialData.url);
      setInterval(initialData.interval);
      setType(initialData.type);
      setSelectedFields(initialData.fields || []);
    }
  }, [mode, initialData]);

  /* ===============================
     🔍 Test API
     =============================== */
  async function testApi() {
    const result = await validateApi(url);
    setApiResult(result);
  }

  /* ===============================
     💾 Save (create or update)
     =============================== */
  function handleSave() {
    const widget = {
      id: initialData?.id ?? crypto.randomUUID(),
      name,
      url,
      interval,
      type,
      fields: selectedFields,
    };

    onSave(widget);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {mode === "edit" ? "Edit Widget" : "Add Widget"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
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

          {apiResult && (
            <FieldSelector
              fields={apiResult.fields}
              selected={selectedFields}
              onChange={setSelectedFields}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-slate-600 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !url || selectedFields.length === 0}
            className="px-5 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
          >
            {mode === "edit" ? "Save Changes" : "Add Widget"}
          </button>
        </div>
      </div>
    </div>
  );
}
