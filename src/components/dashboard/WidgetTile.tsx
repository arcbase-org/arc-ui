"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type Ref } from "react";
import { WIDGET_SIZE_META, WIDGET_SIZES, type DashboardWidgetConfig, type WidgetSize } from "../../lib/dashboard-widgets";

/* Molle calibrate sul feeling di SpringBoard: rapide, smorzate, con un filo di rimbalzo */
const LAYOUT_SPRING = { type: "spring", visualDuration: 0.38, bounce: 0.16 } as const;
const POP_SPRING = { type: "spring", visualDuration: 0.42, bounce: 0.28 } as const;
const CONTROL_SPRING = { type: "spring", visualDuration: 0.28, bounce: 0.3 } as const;
const LONG_PRESS_MS = 280;

interface WidgetTileProps {
  ref?: Ref<HTMLDivElement>;
  widget: DashboardWidgetConfig;
  isEditMode: boolean;
  isPressable?: boolean;
  onDragStart: () => void;
  onDrag: (id: string, point: { x: number; y: number }) => void;
  onDragEnd: () => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onSizeChange: (id: string, size: WidgetSize) => void;
  onResizeStart: () => void;
  onResizePreview: (id: string, size: WidgetSize) => void;
  onResizeEnd: () => void;
  children: ReactNode;
}

const preventTouchScroll = (event: TouchEvent) => event.preventDefault();

export function WidgetTile({
  ref,
  widget,
  isEditMode,
  isPressable,
  onDragStart,
  onDrag,
  onDragEnd,
  onRemove,
  onMove,
  onSizeChange,
  onResizeStart,
  onResizePreview,
  onResizeEnd,
  children,
}: WidgetTileProps) {
  const dragControls = useDragControls();
  const [isLifted, setIsLifted] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPress = useRef<{ timer: ReturnType<typeof setTimeout>; x: number; y: number } | null>(null);

  const cancelLongPress = () => {
    if (longPress.current) clearTimeout(longPress.current.timer);
    longPress.current = null;
  };

  useEffect(
    () => () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
      if (longPress.current) clearTimeout(longPress.current.timer);
      window.removeEventListener("touchmove", preventTouchScroll);
    },
    []
  );

  const sizeMeta = WIDGET_SIZE_META[widget.size];

  const stepSize = (direction: -1 | 1) => {
    const idx = WIDGET_SIZES.indexOf(widget.size);
    const next = WIDGET_SIZES[Math.min(WIDGET_SIZES.length - 1, Math.max(0, idx + direction))];
    if (next !== widget.size) onSizeChange(widget.id, next);
  };

  /* Ridimensionamento dall'angolo: il widget cambia forma dal vivo, come su iOS 18 */
  const handleResizePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();

    const handleEl = e.currentTarget;
    const tileEl = handleEl.closest<HTMLElement>("[data-widget-id]");
    const gridEl = tileEl?.closest<HTMLElement>(".dw-grid");
    if (!tileEl || !gridEl) return;
    try {
      handleEl.setPointerCapture(e.pointerId);
    } catch {}

    const gridRect = gridEl.getBoundingClientRect();
    const startWidth = tileEl.getBoundingClientRect().width;
    const gridStyles = getComputedStyle(gridEl);
    const cols = Math.max(1, gridStyles.gridTemplateColumns.split(" ").filter(Boolean).length);
    const gap = parseFloat(gridStyles.columnGap) || 14;
    const colWidth = (gridRect.width - gap * (cols - 1)) / cols;
    const spanOf = (size: WidgetSize) => (size === "1x" ? 1 : size === "2x" ? Math.min(2, cols) : cols);
    const widthOf = (size: WidgetSize) => colWidth * spanOf(size) + gap * (spanOf(size) - 1);
    // Con 2 colonne "Medio" e "Grande" coincidono: si mantiene la scelta corrente
    const candidates: WidgetSize[] =
      cols >= 3 ? ["1x", "2x", "full"] : ["1x", widget.size === "full" ? "full" : "2x"];

    const startSize = widget.size;
    const startX = e.clientX;
    let moved = false;
    let current: WidgetSize = startSize;

    onResizeStart();
    setIsResizing(true);
    document.body.classList.add("is-resizing-widget");

    const onPointerMove = (ev: globalThis.PointerEvent) => {
      const dx = ev.clientX - startX;
      if (!moved && Math.abs(dx) < 5) return;
      moved = true;
      // Isteresi: serve superare di un terzo di colonna il punto medio per cambiare taglia
      const desired = startWidth + dx;
      const nearest = candidates.reduce((best, c) =>
        Math.abs(widthOf(c) - desired) < Math.abs(widthOf(best) - desired) ? c : best
      );
      if (nearest === current) return;
      const boundary = (widthOf(nearest) + widthOf(current)) / 2;
      const margin = colWidth / 6;
      const crossed = widthOf(nearest) > widthOf(current) ? desired > boundary + margin : desired < boundary - margin;
      if (!crossed) return;
      current = nearest;
      onResizePreview(widget.id, nearest);
    };

    const finish = (ev: globalThis.PointerEvent) => {
      try {
        handleEl.releasePointerCapture(ev.pointerId);
      } catch {}
      document.body.classList.remove("is-resizing-widget");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      setIsResizing(false);
      onResizeEnd();

      if (!moved) {
        // Tocco singolo: passa alla dimensione successiva
        const idx = candidates.indexOf(startSize);
        onSizeChange(widget.id, candidates[(idx + 1) % candidates.length]);
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
  };

  const handleTileKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isEditMode || e.target !== e.currentTarget) return;
    const forward = e.key === "ArrowRight" || e.key === "ArrowDown";
    const backward = e.key === "ArrowLeft" || e.key === "ArrowUp";
    if (e.shiftKey && (forward || backward)) {
      e.preventDefault();
      stepSize(forward ? 1 : -1);
    } else if (forward || backward) {
      e.preventDefault();
      onMove(widget.id, forward ? 1 : -1);
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      onRemove(widget.id);
    }
  };

  const className = [
    "dw-tile",
    `span-${widget.size}`,
    isEditMode && "is-editing",
    isLifted && "is-lifted",
    isResizing && "is-resizing",
    isPressable && !isEditMode && "is-pressable",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      ref={ref}
      layout
      id={`widget-${widget.id}`}
      data-widget-id={widget.id}
      className={className}
      style={{ borderRadius: 22 }}
      tabIndex={isEditMode ? 0 : undefined}
      role={isEditMode ? "group" : undefined}
      aria-roledescription={isEditMode ? "widget" : undefined}
      aria-label={
        isEditMode
          ? `${widget.title}, ${sizeMeta.label.toLowerCase()}. Frecce per spostare, Maiusc più frecce per ridimensionare, Canc per rimuovere`
          : undefined
      }
      onKeyDown={handleTileKeyDown}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.82, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
      transition={{ layout: LAYOUT_SPRING, default: POP_SPRING }}
      whileTap={isPressable && !isEditMode ? { scale: 0.975 } : undefined}
      drag={isEditMode && !isResizing}
      dragControls={dragControls}
      dragListener={false}
      dragSnapToOrigin
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 560, bounceDamping: 38 }}
      whileDrag={{ scale: 1.045 }}
      onPointerDown={(e) => {
        if (!isEditMode || e.button !== 0) return;
        if (e.pointerType !== "touch") {
          dragControls.start(e);
          return;
        }
        // Touch: si solleva con una pressione prolungata, così lo scorrimento della pagina resta libero
        const nativeEvent = e.nativeEvent;
        cancelLongPress();
        longPress.current = {
          x: e.clientX,
          y: e.clientY,
          timer: setTimeout(() => {
            longPress.current = null;
            window.addEventListener("touchmove", preventTouchScroll, { passive: false });
            navigator.vibrate?.(8);
            dragControls.start(nativeEvent);
          }, LONG_PRESS_MS),
        };
      }}
      onPointerMove={(e) => {
        const press = longPress.current;
        if (press && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 8) cancelLongPress();
      }}
      onPointerUp={cancelLongPress}
      onPointerCancel={cancelLongPress}
      onDragStart={() => {
        if (settleTimer.current) clearTimeout(settleTimer.current);
        setIsLifted(true);
        document.body.classList.add("is-dragging-widget");
        onDragStart();
      }}
      onDrag={(event, info) => {
        const point =
          "clientX" in event
            ? { x: event.clientX, y: event.clientY }
            : { x: info.point.x - window.scrollX, y: info.point.y - window.scrollY };
        onDrag(widget.id, point);
      }}
      onDragEnd={() => {
        document.body.classList.remove("is-dragging-widget");
        window.removeEventListener("touchmove", preventTouchScroll);
        onDragEnd();
        // Resta in primo piano finché non rientra nello slot (fallback se la transizione viene interrotta)
        settleTimer.current = setTimeout(() => setIsLifted(false), 900);
      }}
      onDragTransitionEnd={() => {
        if (settleTimer.current) clearTimeout(settleTimer.current);
        setIsLifted(false);
      }}
    >
      <AnimatePresence>
        {isEditMode && (
          <motion.button
            key="remove"
            type="button"
            className="dw-tile-remove"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={CONTROL_SPRING}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(widget.id);
            }}
            tabIndex={-1}
            aria-label={`Rimuovi ${widget.title}`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M1.5 5h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.button>
        )}

        {isEditMode && (
          <motion.button
            key="resize"
            type="button"
            className="dw-tile-resize"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={CONTROL_SPRING}
            onPointerDown={handleResizePointerDown}
            tabIndex={-1}
            aria-label={`Ridimensiona ${widget.title}`}
            title="Trascina per ridimensionare"
          >
            <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
              <path className="dw-tile-resize-arc" d="M 41.1 22.7 A 26 26 0 0 1 22.7 41.1" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        key={widget.size}
        layout="position"
        className="dw-tile-body"
        inert={isEditMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22, delay: 0.08, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
