// "use client";

// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { useDispatch } from "react-redux";

// import ResizableWidget from "./ResizableWidget";
// import { updateWidget } from "@/lib/store/slices/widgetSlice";
// import useMediaQuery from "@/lib/hooks/useMediaQuery";

// /**
//  * SortableWidget
//  *
//  * Wrapper component that enables:
//  * - Drag-and-drop reordering via dnd-kit
//  * - Optional resizing via ResizableWidget
//  * - Persistence of widget dimensions in Redux
//  *
//  * This component acts as a bridge between:
//  * - Drag interactions (dnd-kit)
//  * - Resize interactions (ResizableWidget)
//  * - Global widget state (Redux)
//  */
// export default function SortableWidget({ id, widget, children }) {
//   const dispatch = useDispatch();

//   /**
//    * Detects small screens where resizing should be disabled
//    * and widgets should flow naturally.
//    */
//   const isSmallScreen = useMediaQuery("(max-width: 768px)");

//   /**
//    * dnd-kit sortable bindings for drag-and-drop behavior.
//    */
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id });

//   /**
//    * Inline styles applied during drag interactions.
//    * Transform and opacity are controlled by dnd-kit.
//    */
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : 1,
//   };

//   /**
//    * Handles resize events emitted by ResizableWidget.
//    * Updates widget dimensions in Redux for persistence.
//    * Resizing is ignored on small screens.
//    */
//   const handleResize = (newDimensions) => {
//     if (isSmallScreen) return;

//     dispatch(
//       updateWidget({
//         ...widget,
//         width: newDimensions.width,
//         height: newDimensions.height,
//       })
//     );
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes}>
//       <ResizableWidget
//         initialWidth={isSmallScreen ? null : widget.width}
//         initialHeight={isSmallScreen ? null : widget.height}
//         disableResize={false}
//         isMobileForced={isSmallScreen}
//         onResize={handleResize}
//       >
//         {children({ dragListeners: listeners })}
//       </ResizableWidget>
//     </div>
//   );
// }



























"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";

import ResizableWidget from "./ResizableWidget";
import { updateWidget } from "@/lib/store/slices/widgetSlice";
import useMediaQuery from "@/lib/hooks/useMediaQuery";

/**
 * SortableWidget
 *
 * Wrapper component responsible for:
 * - Enabling drag-and-drop reordering via dnd-kit
 * - Enabling widget resizing on desktop screens
 * - Persisting widget dimensions to Redux
 *
 * On small screens (mobile/tablet):
 * - Resizing is completely disabled
 * - Widgets flow naturally with full-width layout
 * - Stored width/height values are ignored
 */
export default function SortableWidget({ id, widget, children }) {
  const dispatch = useDispatch();

  /**
   * Detects small screens.
   * Resizing must be disabled on these devices to prevent overflow
   * and ensure proper responsive behavior.
   */
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  /**
   * dnd-kit bindings for sortable drag behavior.
   */
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  /**
   * Styles applied during drag interactions.
   * Controlled entirely by dnd-kit.
   */
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  /**
   * Handles resize events from ResizableWidget.
   * Persist dimensions only on non-mobile screens.
   */
  const handleResize = (newDimensions) => {
    if (isSmallScreen) return;

    dispatch(
      updateWidget({
        ...widget,
        width: newDimensions.width,
        height: newDimensions.height,
      })
    );
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ResizableWidget
        /**
         * Width and height are applied only on desktop screens.
         * On small screens, dimensions are ignored to allow fluid layout.
         */
        initialWidth={isSmallScreen ? null : widget.width}
        initialHeight={isSmallScreen ? null : widget.height}

        /**
         * Resizing must be fully disabled on small screens.
         * This prevents inline styles from causing horizontal overflow.
         */
        disableResize={isSmallScreen}

        onResize={handleResize}
      >
        {children({ dragListeners: listeners })}
      </ResizableWidget>
    </div>
  );
}

