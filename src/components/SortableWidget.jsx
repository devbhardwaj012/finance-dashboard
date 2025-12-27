"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ResizableWidget from "./ResizableWidget";
import { useDispatch } from "react-redux";
import { updateWidget } from "@/lib/store/slices/widgetSlice";

export default function SortableWidget({ id, widget, children }) {
  const dispatch = useDispatch();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleResize = (newDimensions) => {
    dispatch(updateWidget({
      ...widget,
      width: newDimensions.width,
      height: newDimensions.height
    }));
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ResizableWidget
        initialWidth={widget.width || null}
        initialHeight={widget.height || null}
        onResize={handleResize}
      >
        {children({ dragListeners: listeners })}
      </ResizableWidget>
    </div>
  );
}