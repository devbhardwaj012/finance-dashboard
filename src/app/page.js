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
import WidgetCard from "@/components/WidgetCard";
import WidgetTable from "@/components/WidgetTable";
import WidgetChart from "@/components/WidgetChart";
import SortableWidget from "@/components/SortableWidget";

// ✅ Disable SSR for this leaf component (DnD-safe)
const AddWidgetPlaceholder = dynamic(
  () => import("@/components/AddWidgetPlaceholder"),
  { ssr: false }
);

const STORAGE_KEY = "dashboard-widgets";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [widgets, setWidgets] = useState([]);

  /* ===============================
     🔁 LOAD FROM localStorage
     =============================== */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setWidgets(JSON.parse(stored));
      } catch {
        console.warn("Failed to parse widget layout");
      }
    }
  }, []);

  /* ===============================
     💾 SAVE TO localStorage
     =============================== */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  /* ===============================
     🧲 Drag handler
     =============================== */
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setWidgets((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  /* ===============================
     🗑 Delete widget
     =============================== */
  function handleDelete(id) {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
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
                  {({ dragListeners }) => {
                    if (widget.type === "table") {
                      return (
                        <WidgetTable
                          key={widget.id}
                          dragListeners={dragListeners}
                          onDelete={() => handleDelete(widget.id)}
                        />
                      );
                    }

                    if (widget.type === "chart") {
                      return (
                        <WidgetChart
                          key={widget.id}
                          dragListeners={dragListeners}
                          onDelete={() => handleDelete(widget.id)}
                        />
                      );
                    }

                    return (
                      <WidgetCard
                        key={widget.id}
                        dragListeners={dragListeners}
                        onDelete={() => handleDelete(widget.id)}
                      />
                    );
                  }}
                </SortableWidget>
              ))}

              <AddWidgetPlaceholder onClick={() => setShowModal(true)} />
            </div>
          </SortableContext>
        </DndContext>
      </section>

      {showModal && (
        <AddWidgetModal
          onClose={() => setShowModal(false)}
          onAdd={(type) =>
            setWidgets((prev) => [
              ...prev,
              { id: crypto.randomUUID(), type },
            ])
          }
        />
      )}
    </main>
  );
}
