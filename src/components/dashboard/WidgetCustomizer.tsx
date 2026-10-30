"use client";

import { AnimatePresence, LayoutGroup, motion, Reorder, useDragControls } from "framer-motion";
import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, Menu, Plus, Search, X } from "lucide-react";
import {
  WIDGET_CATEGORIES,
  WIDGET_PRESETS,
  WIDGET_SIZE_META,
  WIDGET_SIZES,
  getActiveWidgets,
  layoutSignature,
  presetSignature,
  type DashboardWidgetConfig,
  type WidgetPreset,
  type WidgetSize,
} from "../../lib/dashboard-widgets";
import { WidgetSquircle } from "./widget-meta";

export type CustomizerView = "layout" | "gallery";

const PANEL_SPRING = { type: "spring", visualDuration: 0.32, bounce: 0.12 } as const;

/* Larghezze di progetto dei widget, usate per le anteprime in scala nella galleria */
const PREVIEW_DESIGN_WIDTH: Record<WidgetSize, number> = { "1x": 300, "2x": 616, full: 616 };
const PREVIEW_HEIGHT = 195;
const PREVIEW_AVAILABLE_WIDTH = 304;

interface WidgetCustomizerProps {
  widgets: DashboardWidgetConfig[];
  view: CustomizerView;
  onViewChange: (view: CustomizerView) => void;
  renderPreview: (widget: DashboardWidgetConfig) => ReactNode;
  onApplyPreset: (id: WidgetPreset["id"]) => void;
  onAdd: (id: string) => void;
  onReveal: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onSizeChange: (id: string, size: WidgetSize) => void;
  onReorderStart: () => void;
  onReorder: (orderedIds: string[]) => void;
  onReorderEnd: () => void;
  onReset: () => void;
  onClose: () => void;
  onDone: () => void;
}

export function WidgetCustomizer({
  widgets,
  view,
  onViewChange,
  renderPreview,
  onApplyPreset,
  onAdd,
  onReveal,
  onRemove,
  onMove,
  onSizeChange,
  onReorderStart,
  onReorder,
  onReorderEnd,
  onReset,
  onClose,
  onDone,
}: WidgetCustomizerProps) {
  const [query, setQuery] = useState("");

  const active = useMemo(() => getActiveWidgets(widgets), [widgets]);
  const currentSignature = layoutSignature(widgets);
  const activePresetId = WIDGET_PRESETS.find((p) => presetSignature(p) === currentSignature)?.id ?? null;

  const gallerySections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return WIDGET_CATEGORIES.map((category) => ({
      category,
      items: widgets
        .filter((w) => w.category === category)
        .filter((w) => !q || `${w.title} ${w.subtitle} ${w.category}`.toLowerCase().includes(q)),
    })).filter((section) => section.items.length > 0);
  }, [widgets, query]);

  return (
    <div className="wc-root">
      <header className="wc-header">
        <h3 className="wc-title">Widget</h3>
        <button type="button" className="wc-close" onClick={onClose} aria-label="Chiudi pannello" title="Chiudi (Esc)">
          <X size={13} strokeWidth={2.8} />
        </button>
      </header>

      <div className="wc-toolbar">
        <LayoutGroup id="wc-segmented">
          <div className="wc-segmented" role="tablist" aria-label="Sezioni del pannello widget">
            {(
              [
                { id: "layout", label: "Dashboard" },
                { id: "gallery", label: "Galleria" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={view === tab.id}
                className={view === tab.id ? "is-active" : ""}
                onClick={() => onViewChange(tab.id)}
              >
                {view === tab.id && <motion.span layoutId="wc-segment-thumb" className="wc-segment-thumb" transition={PANEL_SPRING} />}
                <span className="wc-segment-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <div className="wc-body">
        <AnimatePresence mode="popLayout" initial={false}>
          {view === "layout" ? (
            <motion.div
              key="layout"
              className="wc-pane"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={PANEL_SPRING}
            >
              <section>
                <h4 className="wc-section-title">Layout rapidi</h4>
                <div className="wc-presets">
                  {WIDGET_PRESETS.map((preset) => {
                    const isActive = activePresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        className={`wc-preset ${isActive ? "is-active" : ""}`}
                        onClick={() => onApplyPreset(preset.id)}
                        aria-pressed={isActive}
                        title={preset.description}
                      >
                        <span className="wc-preset-thumb" aria-hidden="true">
                          {preset.layout.map((item) => (
                            <span key={item.id} className={`span-${item.size}`} />
                          ))}
                        </span>
                        <span className="wc-preset-name">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <h4 className="wc-section-title">Sulla dashboard</h4>
                {active.length > 0 ? (
                  <Reorder.Group as="ul" axis="y" values={active.map((w) => w.id)} onReorder={onReorder} className="wc-group">
                    {active.map((w, index) => (
                      <ActiveWidgetRow
                        key={w.id}
                        widget={w}
                        isFirst={index === 0}
                        isLast={index === active.length - 1}
                        onMove={onMove}
                        onRemove={onRemove}
                        onSizeChange={onSizeChange}
                        onReorderStart={onReorderStart}
                        onReorderEnd={onReorderEnd}
                      />
                    ))}
                  </Reorder.Group>
                ) : (
                  <div className="wc-empty">
                    <span>Nessun widget sulla dashboard.</span>
                    <button type="button" className="wc-link-btn" onClick={() => onViewChange("gallery")}>
                      Apri la galleria
                    </button>
                  </div>
                )}
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              className="wc-pane"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={PANEL_SPRING}
            >
              <label className="wc-search">
                <Search size={15} strokeWidth={2.2} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cerca"
                  aria-label="Cerca widget"
                />
                {query && (
                  <button type="button" className="wc-search-clear" onClick={() => setQuery("")} aria-label="Cancella ricerca">
                    <X size={9} strokeWidth={3.6} />
                  </button>
                )}
              </label>

              {gallerySections.length > 0 ? (
                gallerySections.map((section) => (
                  <section key={section.category}>
                    <h4 className="wc-section-title">{section.category}</h4>
                    <div className="wc-gallery">
                      {section.items.map((w) => (
                        <GalleryCard
                          key={w.id}
                          widget={w}
                          preview={renderPreview(w)}
                          onAdd={() => onAdd(w.id)}
                          onReveal={() => onReveal(w.id)}
                        />
                      ))}
                    </div>
                  </section>
                ))
              ) : (
                <div className="wc-empty">
                  <span>Nessun widget corrisponde a «{query.trim()}».</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="wc-footer">
        <button type="button" className="wc-text-btn" onClick={onReset}>
          Ripristina predefiniti
        </button>
        <button type="button" className="wc-done" onClick={onDone}>
          Fine
        </button>
      </footer>
    </div>
  );
}

function SizeGlyph({ size }: { size: WidgetSize }) {
  const filled = size === "1x" ? 1 : size === "2x" ? 2 : 3;
  return (
    <svg width="17" height="10" viewBox="0 0 17 10" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <rect key={i} x={i * 6} y={1} width={5} height={8} rx={1.6} fill="currentColor" opacity={i < filled ? 1 : 0.28} />
      ))}
    </svg>
  );
}

function ActiveWidgetRow({
  widget,
  isFirst,
  isLast,
  onMove,
  onRemove,
  onSizeChange,
  onReorderStart,
  onReorderEnd,
}: {
  widget: DashboardWidgetConfig;
  isFirst: boolean;
  isLast: boolean;
  onMove: (id: string, direction: -1 | 1) => void;
  onRemove: (id: string) => void;
  onSizeChange: (id: string, size: WidgetSize) => void;
  onReorderStart: () => void;
  onReorderEnd: () => void;
}) {
  const controls = useDragControls();

  const handleGripKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowUp" && !isFirst) {
      e.preventDefault();
      onMove(widget.id, -1);
    } else if (e.key === "ArrowDown" && !isLast) {
      e.preventDefault();
      onMove(widget.id, 1);
    }
  };

  return (
    <Reorder.Item
      as="li"
      value={widget.id}
      dragListener={false}
      dragControls={controls}
      className="wc-row"
      whileDrag={{ scale: 1.03, boxShadow: "0 18px 40px -10px rgba(0,0,0,0.75)", zIndex: 5, borderRadius: 12 }}
      onDragStart={onReorderStart}
      onDragEnd={onReorderEnd}
      transition={{ type: "spring", visualDuration: 0.3, bounce: 0.15 }}
    >
      <button
        type="button"
        className="wc-row-remove"
        onClick={() => onRemove(widget.id)}
        aria-label={`Rimuovi ${widget.title}`}
        title="Rimuovi"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1.5 5h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <WidgetSquircle id={widget.id} size={28} />
      <span className="wc-row-title" title={widget.title}>
        {widget.title}
      </span>
      <span className="wc-size" role="radiogroup" aria-label={`Dimensione di ${widget.title}`}>
        {WIDGET_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={widget.size === size}
            aria-label={WIDGET_SIZE_META[size].label}
            className={widget.size === size ? "is-active" : ""}
            onClick={() => onSizeChange(widget.id, size)}
            title={`${WIDGET_SIZE_META[size].label} · ${WIDGET_SIZE_META[size].detail}`}
          >
            <SizeGlyph size={size} />
          </button>
        ))}
      </span>
      <button
        type="button"
        className="wc-row-grip"
        onPointerDown={(e) => {
          e.preventDefault();
          controls.start(e);
        }}
        onKeyDown={handleGripKeyDown}
        aria-label={`Riordina ${widget.title}. Usa le frecce su e giù`}
        title="Trascina per riordinare"
      >
        <Menu size={16} strokeWidth={2} />
      </button>
    </Reorder.Item>
  );
}

function GalleryCard({
  widget,
  preview,
  onAdd,
  onReveal,
}: {
  widget: DashboardWidgetConfig;
  preview: ReactNode;
  onAdd: () => void;
  onReveal: () => void;
}) {
  const designWidth = PREVIEW_DESIGN_WIDTH[widget.size];
  const scale = Math.min(0.6, PREVIEW_AVAILABLE_WIDTH / designWidth);

  const activate = widget.enabled ? onReveal : onAdd;

  return (
    <div className={`wc-card ${widget.enabled ? "is-added" : ""}`}>
      <div className="wc-card-stage" onClick={activate} style={{ height: Math.round(PREVIEW_HEIGHT * scale) + 32 }}>
        <div className="wc-card-frame" style={{ width: designWidth * scale, height: PREVIEW_HEIGHT * scale }}>
          <div
            className="wc-card-preview"
            style={{ width: designWidth, height: PREVIEW_HEIGHT, transform: `scale(${scale})` }}
            inert
            aria-hidden="true"
          >
            <div className={`dw-tile is-preview span-${widget.size}`}>{preview}</div>
          </div>
          <button
            type="button"
            className={`wc-card-action ${widget.enabled ? "is-added" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              activate();
            }}
            aria-label={widget.enabled ? `${widget.title} è già sulla dashboard: mostralo` : `Aggiungi ${widget.title}`}
            title={widget.enabled ? "Già sulla dashboard" : "Aggiungi"}
          >
            {widget.enabled ? <Check size={11} strokeWidth={3.4} /> : <Plus size={12} strokeWidth={3.2} />}
          </button>
        </div>
      </div>
      <div className="wc-card-text">
        <span className="wc-card-title">{widget.title}</span>
        <span className="wc-card-subtitle">{widget.enabled ? "Sulla dashboard" : widget.subtitle}</span>
      </div>
    </div>
  );
}
