// Avvisi e indicatori di stato di login.ticly.it
import { motion } from "framer-motion";
import { AlertCircle, ShieldCheck, type LucideIcon } from "lucide-react";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

export interface AlertProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Errore animato sopra i moduli di accesso */
export function Alert({ children, className, style }: AlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
      style={{ background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", padding: "0.75rem 1rem", borderRadius: "14px", fontSize: "0.85rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "10px", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", ...style }}
    >
      <AlertCircle size={16} style={{ flexShrink: 0, color: "#f87171" }} />
      <span>{children}</span>
    </motion.div>
  );
}

const NOTICE_COLORS = {
  success: { background: "rgba(74, 222, 128, 0.1)", border: "1px solid rgba(74, 222, 128, 0.25)", color: "#4ade80" },
  error: { background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)", color: "#f87171" },
} satisfies Record<string, CSSProperties>;

export type NoticeProps = ComponentProps<"div"> & { variant?: keyof typeof NOTICE_COLORS };

/** Messaggio di esito dentro le sezioni della dashboard (successo o errore) */
export function Notice({ variant = "success", style, ...props }: NoticeProps) {
  return <div style={{ ...NOTICE_COLORS[variant], padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.82rem", marginBottom: "1rem", ...style }} {...props} />;
}

export interface StatusPillProps {
  /** Verde se attivo, grigio altrimenti */
  active?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}

/** Pillola di stato, es. "2 Attive" / "Inattiva" */
export function StatusPill({ active, children, style }: StatusPillProps) {
  return (
    <span
      style={{
        fontSize: "0.72rem",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "999px",
        background: active ? "rgba(74, 222, 128, 0.1)" : "rgba(255, 255, 255, 0.05)",
        border: `1px solid ${active ? "rgba(74, 222, 128, 0.25)" : "rgba(255, 255, 255, 0.08)"}`,
        color: active ? "#4ade80" : "#888",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

const scoreColor = (value: number) => (value >= 80 ? "#4ade80" : value >= 50 ? "#fcd34d" : "#f87171");
const scoreLabel = (value: number) => (value >= 80 ? "Forte" : value >= 50 ? "Buono" : "Da Rafforzare");

export interface HealthBarProps {
  /** Punteggio da 0 a 100 */
  value: number;
  label?: ReactNode;
  icon?: LucideIcon;
  style?: CSSProperties;
}

/** Barra della salute dell'account: verde da 80, gialla da 50, rossa sotto */
export function HealthBar({ value, label = "Salute dell'Account & Protezione Crittografica", icon: Icon = ShieldCheck, style }: HealthBarProps) {
  return (
    <div style={{ marginTop: "1.25rem", padding: "0.85rem 1.25rem", borderRadius: "14px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.07)", display: "flex", flexDirection: "column", gap: "0.5rem", ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#eee", fontWeight: 600 }}>
          <Icon size={16} style={{ color: "#d4d4d8" }} />
          <span>{label}</span>
        </div>
        <span style={{ color: scoreColor(value), fontWeight: 700, fontSize: "0.85rem" }}>
          {value}% • {scoreLabel(value)}
        </span>
      </div>
      <div style={{ width: "100%", height: "4px", background: "rgba(255, 255, 255, 0.06)", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: scoreColor(value), borderRadius: "999px", transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

export interface DividerProps {
  label?: ReactNode;
  style?: CSSProperties;
}

/** Separatore con testo al centro, es. "Oppure" */
export function Divider({ label = "Oppure", style }: DividerProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0", ...style }}>
      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
      {label && (
        <span style={{ fontSize: "0.72rem", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>{label}</span>
      )}
      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

export interface SpinnerProps {
  label?: ReactNode;
}

/** Caricamento, es. "Sincronizzazione workspace..." */
export function Spinner({ label }: SpinnerProps) {
  return (
    <div style={{ textAlign: "center", color: "#888" }}>
      <div style={{ width: "28px", height: "28px", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: label ? "0 auto 1rem" : "0 auto" }} />
      {label && <div style={{ fontSize: "0.9rem" }}>{label}</div>}
    </div>
  );
}
