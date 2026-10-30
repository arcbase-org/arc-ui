// Finestre e contenitori di login.ticly.it: sfondo con wallpaper, split window
// del login, finestra app della dashboard, area contenuti e barra mobile.
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cx } from "../lib/cx";
import { GLASS_BLUR } from "../lib/glass";
import { DEFAULT_WALLPAPER_STYLE } from "../lib/wallpapers";

export interface DesktopViewportProps extends ComponentProps<"div"> {
  /** Sfondo CSS (default: Dolomiti al tramonto, come in login) */
  wallpaper?: string;
  hideScrollbars?: boolean;
}

/** Sfondo a tutto schermo con il wallpaper (`.desktop-viewport`) */
export function DesktopViewport({ wallpaper = DEFAULT_WALLPAPER_STYLE, hideScrollbars, className, style, ...props }: DesktopViewportProps) {
  return (
    <div
      suppressHydrationWarning
      className={cx("desktop-viewport", hideScrollbars && "hide-scrollbars", className)}
      style={{ background: wallpaper, ...style }}
      {...props}
    />
  );
}

export interface SplitWindowProps {
  /** Pannello sinistro: presentazione (titolo, descrizione, FeatureRow…) */
  left: ReactNode;
  /** Pannello destro: modulo (accesso, registrazione, recupero…) */
  right: ReactNode;
  wallpaper?: string;
  /** Larghezza massima del contenuto a destra (login: 390px) */
  contentWidth?: number | string;
  className?: string;
  style?: CSSProperties;
}

/** La finestra divisa in due della pagina di accesso (`.login-window-frame`) */
export function SplitWindow({ left, right, wallpaper = DEFAULT_WALLPAPER_STYLE, contentWidth = 390, className, style }: SplitWindowProps) {
  return (
    <div suppressHydrationWarning className={cx("desktop-viewport login-viewport", className)} style={{ background: wallpaper, ...style }}>
      <div className="login-window-frame">
        <div className="login-left-panel" style={GLASS_BLUR}>
          {left}
        </div>
        <div className="login-right-panel" style={GLASS_BLUR}>
          <div style={{ maxWidth: typeof contentWidth === "number" ? `${contentWidth}px` : contentWidth, width: "100%", margin: "0 auto" }}>
            {right}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface AppWindowProps extends HTMLMotionProps<"div"> {
  /** Restringe la finestra quando è aperto un drawer laterale */
  editMode?: boolean;
  hideScrollbars?: boolean;
}

/** La finestra app della dashboard, con l'animazione d'apertura (`.app-window-frame`) */
export function AppWindow({ editMode, hideScrollbars, className, ...props }: AppWindowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
      // A fine animazione il filtro va tolto del tutto: anche "blur(0px)" rende la finestra
      // un backdrop root, e i pannelli dentro non sfocherebbero più lo sfondo
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      exit={{ opacity: 0, scale: 0.92, filter: "blur(20px)", transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      className={cx("app-window-frame", editMode && "is-edit-mode", hideScrollbars && "hide-scrollbars", className)}
      {...props}
    />
  );
}

export interface MainContentProps extends ComponentProps<"div"> {
  /** Lascia spazio a un drawer aperto */
  drawerOpen?: boolean;
  hideScrollbars?: boolean;
}

/** L'area dei contenuti accanto alla sidebar (`.premium-main-content`) */
export function MainContent({ drawerOpen, hideScrollbars, className, style, ...props }: MainContentProps) {
  return (
    <div
      className={cx("premium-main-content", drawerOpen && "drawer-open", hideScrollbars && "hide-scrollbars", className)}
      style={{ ...GLASS_BLUR, ...style }}
      {...props}
    />
  );
}

export interface MobileHeaderBarProps {
  title?: ReactNode;
  /** Mostra il materiale sfocato e il titolo, come quando si scorre */
  scrolled?: boolean;
  onMenuClick?: () => void;
  onAvatarClick?: () => void;
  avatarSrc?: string | null;
  /** Nome o email: se manca l'immagine si mostra l'iniziale */
  avatarFallback?: string | null;
  menuLabel?: string;
  avatarLabel?: string;
}

/** Barra di navigazione mobile in stile iOS: trasparente in cima, sfocata quando si scorre */
export function MobileHeaderBar({
  title,
  scrolled,
  onMenuClick,
  onAvatarClick,
  avatarSrc,
  avatarFallback,
  menuLabel = "Apri menu",
  avatarLabel = "Apri profilo",
}: MobileHeaderBarProps) {
  return (
    <div className={cx("mobile-header-bar", scrolled && "is-scrolled")}>
      <button type="button" className="mobile-nav-btn" onClick={onMenuClick} aria-label={menuLabel}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M3 6h12M3 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <span className="mobile-nav-title" aria-hidden={!scrolled}>
        {title}
      </span>
      <button type="button" className="mobile-nav-avatar" onClick={onAvatarClick} aria-label={avatarLabel}>
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarSrc} alt="" />
        ) : (
          <span>{(avatarFallback || "?").charAt(0).toUpperCase()}</span>
        )}
      </button>
    </div>
  );
}
