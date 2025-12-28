"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import useMediaQuery from "@/lib/hooks/useMediaQuery";

/**
 * ResizableWidget
 *
 * Handles size management for dashboard widgets.
 * This component is responsible only for sizing, not layout.
 *
 * Behavior:
 * - Desktop: resizable, persisted width/height
 * - Mobile: full-width, auto-height, resizing disabled
 */
export default function ResizableWidget({
  children,
  initialWidth = null,
  initialHeight = null,
  minWidth = 250,
  minHeight = 150,
  onResize,
  disableResize = false,
}) {
  const defaultWidth = 450;
  const defaultHeight = 320;

  const isMobile = useMediaQuery("(max-width: 768px)");

  /**
   * Internal dimension state.
   * Used only on non-mobile screens.
   */
  const [dimensions, setDimensions] = useState({
    width: initialWidth || defaultWidth,
    height: initialHeight || defaultHeight,
  });

  const [isResizing, setIsResizing] = useState(false);

  const widgetRef = useRef(null);

  const resizeRef = useRef({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    direction: "",
  });

  /**
   * Sync initial dimensions on desktop only.
   * Mobile layout must never reuse persisted sizes.
   */
  useEffect(() => {
    if (isMobile || disableResize) {
      setDimensions({ width: null, height: null });
      return;
    }

    setDimensions({
      width: initialWidth || defaultWidth,
      height: initialHeight || defaultHeight,
    });
  }, [isMobile, disableResize, initialWidth, initialHeight]);

  /**
   * Starts a resize interaction.
   */
  const handleMouseDown = useCallback(
    (e, direction) => {
      if (disableResize || isMobile) return;

      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);

      const rect = widgetRef.current?.getBoundingClientRect();

      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: rect?.width || defaultWidth,
        startHeight: rect?.height || defaultHeight,
        direction,
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [disableResize, isMobile]
  );

  /**
   * Updates dimensions while resizing.
   */
  const handleMouseMove = useCallback(
    (e) => {
      if (!resizeRef.current.direction) return;

      const {
        startX,
        startY,
        startWidth,
        startHeight,
        direction,
      } = resizeRef.current;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes("right")) {
        newWidth = Math.max(minWidth, startWidth + (e.clientX - startX));
      }
      if (direction.includes("left")) {
        newWidth = Math.max(minWidth, startWidth - (e.clientX - startX));
      }
      if (direction.includes("bottom")) {
        newHeight = Math.max(minHeight, startHeight + (e.clientY - startY));
      }
      if (direction.includes("top")) {
        newHeight = Math.max(minHeight, startHeight - (e.clientY - startY));
      }

      const next = { width: newWidth, height: newHeight };
      setDimensions(next);
      onResize?.(next);
    },
    [minWidth, minHeight, onResize]
  );

  /**
   * Ends resize interaction.
   */
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    resizeRef.current.direction = "";

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const resizeHandles = [
    { direction: "top-left", cursor: "nw-resize", className: "top-0 left-0" },
    { direction: "top-right", cursor: "ne-resize", className: "top-0 right-0" },
    { direction: "bottom-left", cursor: "sw-resize", className: "bottom-0 left-0" },
    { direction: "bottom-right", cursor: "se-resize", className: "bottom-0 right-0" },
    { direction: "top", cursor: "n-resize", className: "top-0 left-2 right-2" },
    { direction: "bottom", cursor: "s-resize", className: "bottom-0 left-2 right-2" },
    { direction: "left", cursor: "w-resize", className: "left-0 top-2 bottom-2" },
    { direction: "right", cursor: "e-resize", className: "right-0 top-2 bottom-2" },
  ];

  return (
    <div
      ref={widgetRef}
      className="relative w-full"
      style={{
        /**
         * Critical mobile override:
         * - Mobile must always be full width
         * - Height must be content-driven
         */
        width: isMobile ? "100%" : dimensions.width,
        height: isMobile ? "auto" : dimensions.height,
        userSelect: isResizing ? "none" : "auto",
      }}
    >
      {children}

      {/* Resize handles are desktop-only */}
      {!disableResize &&
        !isMobile &&
        resizeHandles.map(({ direction, cursor, className }) => (
          <div
            key={direction}
            className={`absolute ${className} z-10 opacity-0 hover:opacity-100`}
            style={{
              cursor,
              width:
                direction.includes("left") || direction.includes("right")
                  ? "8px"
                  : undefined,
              height:
                direction.includes("top") || direction.includes("bottom")
                  ? "8px"
                  : undefined,
            }}
            onMouseDown={(e) => handleMouseDown(e, direction)}
          />
        ))}

      {/* Size indicator shown only during desktop resize */}
      {isResizing && !disableResize && !isMobile && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded z-20">
          {Math.round(dimensions.width)} × {Math.round(dimensions.height)}
        </div>
      )}
    </div>
  );
}
