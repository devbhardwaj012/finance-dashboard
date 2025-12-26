"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import Navbar from "@/components/Navbar";
import AddWidgetModal from "@/components/AddWidgetModal";
import SortableWidget from "@/components/SortableWidget";

import CardWidget from "@/components/widgets/CardWidget";
import TableWidget from "@/components/widgets/TableWidget";
import ChartWidget from "@/components/widgets/ChartWidget";

const AddWidgetPlaceholder = dynamic(
  () => import("@/components/AddWidgetPlaceholder"),
  { ssr: false }
);

const STORAGE_KEY = "dashboard-widgets";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [widgets, setWidgets] = useState([]);
  const [editingWidget, setEditingWidget] = useState(null);

  /* 🔁 Load */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setWidgets(JSON.parse(stored));
  }, []);

  /* 💾 Save */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  /* 🧲 Drag */
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setWidgets((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  /* 🗑 Delete */
  function handleDelete(id) {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }

  /* ✏️ Edit */
  function handleEdit(widget) {
    setEditingWidget(widget);
    setShowModal(true);
  }

  /* 💾 Save (create OR update) */
  function handleSave(widget) {
    setWidgets((prev) => {
      const exists = prev.find((w) => w.id === widget.id);
      if (!exists) return [...prev, widget];

      return prev.map((w) => (w.id === widget.id ? widget : w));
    });

    setEditingWidget(null);
    setShowModal(false);
  }

  function renderWidget(widget, dragListeners) {
    const props = {
      widget,
      dragListeners,
      onDelete: () => handleDelete(widget.id),
      onEdit: () => handleEdit(widget), // 🔥 IMPORTANT
    };

    if (widget.type === "table") return <TableWidget {...props} />;
    if (widget.type === "chart") return <ChartWidget {...props} />;
    return <CardWidget {...props} />;
  }

  return (
    <main className="min-h-screen">
      <Navbar onAddWidget={() => setShowModal(true)} />

      <section className="p-6">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={widgets.map((w) => w.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {widgets.map((widget) => (
                <SortableWidget key={widget.id} id={widget.id}>
                  {({ dragListeners }) =>
                    renderWidget(widget, dragListeners)
                  }
                </SortableWidget>
              ))}

              <AddWidgetPlaceholder onClick={() => setShowModal(true)} />
            </div>
          </SortableContext>
        </DndContext>
      </section>

      {showModal && (
        <AddWidgetModal
          mode={editingWidget ? "edit" : "create"}
          initialData={editingWidget}
          onClose={() => {
            setShowModal(false);
            setEditingWidget(null);
          }}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
