"use client";

import CardWidget from "./CardWidget";
import TableWidget from "./TableWidget";
import ChartWidget from "./ChartWidget";

/**
 * WidgetRenderer
 *
 * Centralized renderer responsible for selecting and rendering
 * the correct widget component based on widget type.
 *
 * Responsibilities:
 * - Act as a single decision point for widget rendering
 * - Forward shared props consistently to all widget types
 * - Encapsulate widget-type branching logic
 *
 * This abstraction keeps parent components clean and
 * makes it easy to introduce new widget types in the future.
 */
export default function WidgetRenderer({
  widget,
  dragListeners,
  onEdit,
  onDelete,
}) {
  /**
   * Common props shared across all widget types.
   */
  const props = { widget, dragListeners, onEdit, onDelete };

  if (widget.type === "table") {
    return <TableWidget {...props} />;
  }

  if (widget.type === "chart") {
    return <ChartWidget {...props} />;
  }

  return <CardWidget {...props} />;
}
