// Bottoni di login.ticly.it: modular (dashboard e accesso), CTA (piani e checkout),
// cir-btn (pillola bianca con freccia) e il pulsante icona dei pannelli.
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, CSSProperties } from "react";
import { cx } from "../lib/cx";

export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const MODULAR_CLASS: Record<ButtonVariant, string> = {
  primary: "modular-btn-primary",
  secondary: "modular-btn-secondary",
  danger: "modular-btn-danger",
};

// Misure che login.ticly.it usa sopra le classi modular-btn-*
const MODULAR_SIZE: Record<ButtonSize, CSSProperties | undefined> = {
  // Azioni nelle liste e nelle intestazioni delle sezioni
  sm: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", padding: "0.45rem 1rem" },
  md: undefined,
  // Pulsante di invio dei moduli di accesso
  lg: { padding: "0.85rem", fontSize: "0.92rem", fontWeight: 600 },
};

interface ModularOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Occupa tutta la larghezza */
  block?: boolean;
}

function modularStyle(size: ButtonSize, block: boolean | undefined, style: CSSProperties | undefined): CSSProperties {
  return { ...MODULAR_SIZE[size], ...(block ? { width: "100%" } : null), ...style };
}

export type ButtonProps = ComponentProps<"button"> & ModularOwnProps;

/** Bottone della dashboard e dell'accesso (`.modular-btn-primary`, `-secondary`, `-danger`) */
export function Button({ variant = "primary", size = "md", block, className, style, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cx(MODULAR_CLASS[variant], className)} style={modularStyle(size, block, style)} {...props} />;
}

export type ButtonLinkProps = ComponentProps<"a"> & ModularOwnProps;

/** Come Button, ma è un link */
export function ButtonLink({ variant = "secondary", size = "md", block, className, style, ...props }: ButtonLinkProps) {
  return <a className={cx(MODULAR_CLASS[variant], className)} style={modularStyle(size, block, style)} {...props} />;
}

export type CtaButtonProps = ComponentProps<"button"> & { variant?: "primary" | "secondary" };

/** Bottone grande delle pagine piani e checkout (`.btn .btn-primary`, `.btn-secondary`) */
export function CtaButton({ variant = "primary", className, type = "button", ...props }: CtaButtonProps) {
  return <button type={type} className={cx("btn", `btn-${variant}`, className)} {...props} />;
}

export type CtaLinkProps = ComponentProps<"a"> & { variant?: "primary" | "secondary" };

/** Come CtaButton, ma è un link */
export function CtaLink({ variant = "primary", className, ...props }: CtaLinkProps) {
  return <a className={cx("btn", `btn-${variant}`, className)} {...props} />;
}

export type CirButtonProps = ComponentProps<"a"> & { arrow?: boolean };

/** Pillola bianca con freccia che si sposta al passaggio del mouse (`.cir-btn`) */
export function CirButton({ arrow = true, className, children, ...props }: CirButtonProps) {
  return (
    <a className={cx("cir-btn", className)} {...props}>
      {children}
      {arrow && <ArrowUpRight className="cir-btn__arrow" aria-hidden="true" />}
    </a>
  );
}

export type IconButtonProps = ComponentProps<"button"> & {
  /** Tondo da 28px, come il pulsante di chiusura dei drawer */
  round?: boolean;
};

/** Pulsante quadrato con icona dei pannelli (`.widget-edit-btn`) */
export function IconButton({ round, className, style, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cx("widget-edit-btn", className)}
      style={{ ...(round ? { width: "28px", height: "28px", borderRadius: "50%" } : null), ...style }}
      {...props}
    />
  );
}
