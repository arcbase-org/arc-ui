// Sidebar della dashboard di login.ticly.it, con la navigazione "corner game"
// (i pulsanti adiacenti all'attivo modellano gli angoli attorno alla pillola).
import type { ComponentProps, ReactNode } from "react";
import { cx } from "../lib/cx";
import { GLASS_BLUR } from "../lib/glass";

export interface SidebarProps extends ComponentProps<"aside"> {
  /** Su mobile apre la sidebar sopra i contenuti, con l'overlay */
  open?: boolean;
  onClose?: () => void;
}

/** La sidebar della finestra app (`.premium-sidebar`) */
export function Sidebar({ open, onClose, className, style, children, ...props }: SidebarProps) {
  return (
    <>
      {open && <div className="mobile-sidebar-overlay" onClick={onClose} />}
      <aside className={cx("premium-sidebar", open && "open", className)} style={{ ...GLASS_BLUR, ...style }} {...props}>
        {children}
      </aside>
    </>
  );
}

/** Gruppo di voci con gli angoli che si modellano (`.premium-nav-group`) */
export function SidebarNav({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("premium-nav-group", className)} {...props} />;
}

export interface SidebarNavItemProps extends ComponentProps<"button"> {
  icon?: ReactNode;
  active?: boolean;
}

/** Voce della navigazione (`.premium-nav-item`) */
export function SidebarNavItem({ icon, active, className, children, type = "button", ...props }: SidebarNavItemProps) {
  return (
    <button type={type} className={cx("premium-nav-item", active && "active", className)} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

/** Gruppo in fondo alla sidebar, utente ed Esci (`.bottom-corner-group`) */
export function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("bottom-corner-group", className)} {...props} />;
}

export interface SidebarUserProps {
  name?: string | null;
  email?: string | null;
  avatarSrc?: string | null;
}

/** Utente collegato in fondo alla sidebar (`.wf-user-box`) */
export function SidebarUser({ name, email, avatarSrc }: SidebarUserProps) {
  return (
    <div className="wf-user-box" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      {avatarSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarSrc} alt="Avatar" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }} />
      ) : (
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "#fff", flexShrink: 0, border: "1px solid rgba(255,255,255,0.05)" }}>
          {name ? name.charAt(0).toUpperCase() : "U"}
        </div>
      )}
      <div style={{ overflow: "hidden" }}>
        <div className="wf-user-name" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name || "Utente"}</div>
        <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.8rem", color: "#888" }}>{email || "Accesso in corso..."}</div>
      </div>
    </div>
  );
}

/** Pulsante Esci in fondo alla sidebar (`.wf-logout-btn`) */
export function SidebarLogout({ children = "Esci Account", style, type = "button", ...props }: ComponentProps<"button">) {
  return (
    <button type={type} className="wf-logout-btn" style={{ display: "flex", alignItems: "center", gap: "0.75rem", ...style }} {...props}>
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      <span>{children}</span>
    </button>
  );
}

export interface TokenBoxProps {
  label?: ReactNode;
  value: number;
  max: number;
}

/** Saldo dei crediti con barra di avanzamento (`.token-box`) */
export function TokenBox({ label = "Crediti AI", value, max }: TokenBoxProps) {
  return (
    <div className="token-box">
      <div className="token-box-header">
        <span>{label}</span>
        <span style={{ color: "#fff" }}>{value.toLocaleString("it-IT")} / {max.toLocaleString("it-IT")}</span>
      </div>
      <div className="token-progress-bg">
        <div className="token-progress-fill" style={{ width: `${max > 0 ? Math.min((value / max) * 100, 100) : 0}%` }} />
      </div>
    </div>
  );
}
