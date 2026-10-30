// Pannelli in vetro di login.ticly.it e gruppi con il "corner game"
import type { ComponentProps } from "react";
import { cx } from "../lib/cx";

export type GlassPanelProps = ComponentProps<"div"> & {
  /** Dissolvenza d'ingresso (`.animate-fade-in`) */
  animated?: boolean;
};

/** Pannello in vetro delle pagine piani e checkout (`.glass-panel`) */
export function GlassPanel({ animated, className, ...props }: GlassPanelProps) {
  return <div className={cx("glass-panel", animated && "animate-fade-in", className)} {...props} />;
}

/** Pannello chiaro con bordo che si illumina al passaggio del mouse (`.modular-panel`) */
export function ModularPanel({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("modular-panel", className)} {...props} />;
}

export type CornerGroupProps = ComponentProps<"div"> & {
  /** "column": pannelli impilati; "row": pannelli affiancati (in colonna sotto i 900px) */
  direction?: "column" | "row";
};

/** Gruppo di ModularPanel con angoli esterni grandi e interni piccoli */
export function CornerGroup({ direction = "column", className, ...props }: CornerGroupProps) {
  return <div className={cx(direction === "row" ? "corner-row-group" : "corner-col-group", className)} {...props} />;
}
