// Pannelli laterali e bottom sheet di login.ticly.it, con le loro parti
import { AnimatePresence, motion } from "framer-motion";
import { X, type LucideIcon } from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "../lib/cx";
import { GLASS_BLUR } from "../lib/glass";

export interface DrawerProps {
  open: boolean;
  /**
   * "panel": pannello laterale da 384px, come la personalizzazione dei widget (`.modular-customizer-drawer`).
   * "split": pannello da 420px, come la configurazione 2FA (`.split-drawer-2fa`).
   */
  variant?: "panel" | "split";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

/** Pannello che si apre di lato dentro la finestra app */
export function Drawer({ open, variant = "panel", children, className, style, "aria-label": ariaLabel }: DrawerProps) {
  const width = variant === "split" ? 420 : 384;

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key={`drawer-${variant}`}
          initial={{ width: 0, opacity: 0, x: 20 }}
          animate={{ width, opacity: 1, x: 0 }}
          exit={{ width: 0, opacity: 0, x: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cx(variant === "split" ? "split-drawer-2fa" : "modular-customizer-drawer", className)}
          style={variant === "panel" ? { ...GLASS_BLUR, ...style } : style}
          aria-label={ariaLabel}
        >
          {children}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  "aria-label"?: string;
}

/** Pannello che sale dal basso su mobile, con lo sfondo scuro (montato su <body>) */
export function BottomSheet({ open, onClose, children, "aria-label": ariaLabel }: BottomSheetProps) {
  // Il portale serve solo nel browser: un filter sulla finestra app altererebbe il position: fixed
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="customizer-sheet-backdrop"
          className="customizer-sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      {open && (
        <motion.aside
          key="modular-customizer-sheet"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="modular-customizer-drawer is-sheet"
          aria-label={ariaLabel}
        >
          {children}
        </motion.aside>
      )}
    </AnimatePresence>,
    document.body
  );
}

export interface DrawerHeaderProps {
  icon?: LucideIcon;
  title: ReactNode;
  subtitle?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
}

/** Intestazione di un Drawer con icona, titolo e pulsante di chiusura */
export function DrawerHeader({ icon: Icon, title, subtitle, onClose, closeLabel = "Chiudi pannello" }: DrawerHeaderProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {Icon && (
          <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={18} style={{ color: "#e4e4e7" }} />
          </div>
        )}
        <div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", margin: 0 }}>{title}</h3>
          {subtitle && <p style={{ fontSize: "0.72rem", color: "#888", margin: 0, marginTop: "2px" }}>{subtitle}</p>}
        </div>
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="widget-edit-btn" style={{ width: "28px", height: "28px", borderRadius: "50%" }} title={closeLabel} aria-label={closeLabel}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export interface DrawerSectionTitleProps {
  title: ReactNode;
  /** Testo a destra, es. "10 codici" */
  meta?: ReactNode;
}

/** Titolo maiuscolo di una sezione del Drawer (`.drawer-section-title`) */
export function DrawerSectionTitle({ title, meta }: DrawerSectionTitleProps) {
  return (
    <div className="drawer-section-title">
      <span>{title}</span>
      {meta && <span style={{ fontSize: "0.7rem", color: "#666" }}>{meta}</span>}
    </div>
  );
}

export interface BackupCodesProps {
  codes: string[];
}

/** Griglia dei codici di backup monouso (`.backup-codes-grid`) */
export function BackupCodes({ codes }: BackupCodesProps) {
  return (
    <div className="backup-codes-grid">
      {codes.map((code, idx) => (
        <div key={idx} className="backup-code-pill">
          {code}
        </div>
      ))}
    </div>
  );
}
