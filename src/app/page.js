"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import Navbar from "@/components/layout/Navbar";
import AddWidgetModal from "@/components/modals/AddWidgetModal";
import SortableWidget from "@/components/widgets/SortableWidget";
import AddWidgetPlaceholder from "@/components/widgets/AddWidgetPlaceholder";

import {
  addWidget,
  updateWidget,
  removeWidget,
  reorderWidgets,
} from "@/lib/store/slices/widgetSlice";

import CardWidget from "@/components/widgets/CardWidget";
import TableWidget from "@/components/widgets/TableWidget";
import ChartWidget from "@/components/widgets/ChartWidget";

/**
 * Helper responsible for returning the initial widget configuration.
 * It internally decides whether to load from localStorage or fall back
 * to the default dashboard configuration.
 */
import { getInitialWidgets } from "@/lib/config/defaultDashboard";

/**
 * Storage key used to persist dashboard widgets in localStorage.
 */
const STORAGE_KEY = "dashboard-widgets";

/**
 * Home
 *
 * Root dashboard page responsible for:
 * - Rendering widgets
 * - Managing drag-and-drop reordering
 * - Persisting widget state
 * - Handling widget creation, editing, and deletion
 */
export default function Home() {
  const dispatch = useDispatch();
  const widgets = useSelector((state) => state.widgets);

  /**
   * UI state for widget creation/editing modal.
   */
  const [showModal, setShowModal] = useState(false);
  const [editingWidget, setEditingWidget] = useState(null);

  /**
   * Used to prevent hydration mismatch by ensuring client-only logic
   * (such as localStorage access) runs after mount.
   */
  const [mounted, setMounted] = useState(false);

  /**
   * Initialize dashboard widgets on first client render.
   * Widgets are loaded from localStorage if available,
   * otherwise the default configuration is used.
   */
  useEffect(() => {
    setMounted(true);

    try {
      const initialWidgets = getInitialWidgets(STORAGE_KEY);
      dispatch(reorderWidgets(initialWidgets));
    } catch {
      // Fail silently to avoid breaking the dashboard UI
    }
  }, [dispatch]);

  /**
   * Persist widgets to localStorage whenever the widget state changes.
   * This effect is skipped during the initial render phase.
   */
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    } catch {
      // Fail silently to avoid blocking UI updates
    }
  }, [widgets, mounted]);

  /**
   * Handles widget reordering after a drag-and-drop interaction.
   * Computes old and new positions and updates the store accordingly.
   */
  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = widgets.findIndex((w) => w.id === active.id);
    const newIndex = widgets.findIndex((w) => w.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(widgets, oldIndex, newIndex);
      dispatch(reorderWidgets(reordered));
    }
  }

  /**
   * Deletes a widget after user confirmation.
   */
  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this widget?")) {
      dispatch(removeWidget(id));
    }
  }

  /**
   * Opens the widget modal in edit mode with pre-filled data.
   */
  function handleEdit(widget) {
    setEditingWidget(widget);
    setShowModal(true);
  }

  /**
   * Saves widget data.
   * Creates a new widget or updates an existing one depending on mode.
   */
  function handleSave(widget) {
    if (editingWidget) {
      dispatch(updateWidget(widget));
    } else {
      dispatch(addWidget(widget));
    }

    setEditingWidget(null);
    setShowModal(false);
  }

  /**
   * Renders the correct widget component based on its type.
   */
  function renderWidget(widget, dragListeners) {
    const props = {
      widget,
      dragListeners,
      onDelete: () => handleDelete(widget.id),
      onEdit: () => handleEdit(widget),
    };

    if (widget.type === "table") return <TableWidget {...props} />;
    if (widget.type === "chart") return <ChartWidget {...props} />;
    return <CardWidget {...props} />;
  }

  /**
   * Skeleton UI rendered before client hydration completes.
   * Prevents server/client markup mismatch.
   */
  if (!mounted) {
    return (
      <main className="min-h-screen">
        <Navbar onAddWidget={() => {}} />
        <section className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar onAddWidget={() => setShowModal(true)} />

      <section className="p-6">
        {widgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold mb-2 text-slate-700 dark:text-slate-300">
              No widgets yet
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Get started by adding your first widget
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition"
            >
              Add Your First Widget
            </button>
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={widgets.map((w) => w.id)}
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-wrap gap-6 justify-start items-start">
                {widgets.map((widget) => (
                  <div key={widget.id} className="flex-shrink-0 min-w-0">
                    <SortableWidget id={widget.id} widget={widget}>
                      {({ dragListeners }) =>
                        renderWidget(widget, dragListeners)
                      }
                    </SortableWidget>
                  </div>
                ))}

                <AddWidgetPlaceholder onClick={() => setShowModal(true)} />
              </div>
            </SortableContext>
          </DndContext>
        )}
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
