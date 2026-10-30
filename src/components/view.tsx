// Contenitore e intestazione delle sezioni della dashboard di login.ticly.it
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cx } from "../lib/cx";

export interface ViewProps extends ComponentProps<"div"> {
  /** Dissolvenza d'ingresso (`.animate-fade-in`), attiva di default */
  animated?: boolean;
}

/** Contenitore di una sezione (`.view-container`) */
export function View({ animated = true, className, ...props }: ViewProps) {
  return <div className={cx("view-container", animated && "animate-fade-in", className)} {...props} />;
}

export interface ViewHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Azioni a destra del titolo (es. un Button piccolo) */
  actions?: ReactNode;
  /** Contenuto sotto il sottotitolo (es. HealthBar) */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Titolo e sottotitolo di una sezione (`.view-header`) */
export function ViewHeader({ title, subtitle, actions, children, className, style }: ViewHeaderProps) {
  if (actions) {
    return (
      <div className={cx("view-header", className)} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem", ...style }}>
        <div>
          <h2 className="view-title">{title}</h2>
          {subtitle && <p className="view-subtitle">{subtitle}</p>}
        </div>
        {actions}
        {children}
      </div>
    );
  }

  return (
    <div className={cx("view-header", className)} style={{ marginBottom: "1.5rem", ...style }}>
      <h2 className="view-title">{title}</h2>
      {subtitle && <p className="view-subtitle">{subtitle}</p>}
      {children}
    </div>
  );
}
