"use client";

import { useState } from "react";
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
import AddWidgetPlaceholder from "@/components/AddWidgetPlaceholder";
import SortableWidget from "@/components/SortableWidget";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [widgets, setWidgets] = useState([]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setWidgets((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  function renderWidget(widget) {
  if (widget.type === "table")
    return <WidgetTable key={widget.id} />;

  if (widget.type === "chart")
    return <WidgetChart key={widget.id} />;

  return <WidgetCard key={widget.id} />;
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
      if (widget.type === "table")
        return <WidgetTable key={widget.id} dragListeners={dragListeners} />;

      if (widget.type === "chart")
        return <WidgetChart key={widget.id} dragListeners={dragListeners} />;

      return <WidgetCard key={widget.id} dragListeners={dragListeners} />;
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
          onAdd={(mode) =>
            setWidgets((prev) => [
              ...prev,
              { id: crypto.randomUUID(), type: mode },
            ])
          }
        />
      )}
    </main>
  );
}
