// Elementi delle pagine di accesso e del profilo di login.ticly.it
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "../lib/cx";

export type LogoProps = Omit<ComponentProps<typeof Link>, "href"> & { href?: ComponentProps<typeof Link>["href"] };

/** Logo testuale "ticly" in Dela Gothic One (`.logo`) */
export function Logo({ href = "/", className, style, children = "ticly", ...props }: LogoProps) {
  return (
    <Link href={href} className={cx("logo", className)} style={{ display: "inline-flex", ...style }} {...props}>
      {children}
    </Link>
  );
}

export interface PanelHeroProps {
  title: ReactNode;
  description?: ReactNode;
}

/** Titolo grande e descrizione del pannello sinistro della SplitWindow */
export function PanelHero({ title, description }: PanelHeroProps) {
  return (
    <>
      <h1 style={{ fontSize: "2.35rem", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.03em", color: "#fff", marginBottom: "0.85rem" }}>{title}</h1>
      {description && <p style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "0.95rem", lineHeight: 1.55, maxWidth: "90%" }}>{description}</p>}
    </>
  );
}

export interface FormHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Contenuto sotto la descrizione (es. AppRedirectChip) */
  children?: ReactNode;
}

/** Titolo del modulo nel pannello destro, es. "Accedi al tuo Account" */
export function FormHeader({ title, description, children }: FormHeaderProps) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "1.85rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>{title}</h2>
      {description && <p style={{ color: "rgba(255, 255, 255, 0.55)", fontSize: "0.88rem", marginTop: "4px" }}>{description}</p>}
      {children}
    </div>
  );
}

/** Colonna di FeatureRow */
export function FeatureList({ style, ...props }: ComponentProps<"div">) {
  return <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1.75rem 0", ...style }} {...props} />;
}

export interface FeatureRowProps {
  icon: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
}

/** Riga con icona, titolo e descrizione, es. "Passkey FIDO2 Native" */
export function FeatureRow({ icon: Icon, title, description }: FeatureRowProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.03)", padding: "0.85rem 1.15rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#eee", flexShrink: 0 }}>
        <Icon size={17} />
      </div>
      <div>
        <div style={{ color: "#fff", fontSize: "0.88rem", fontWeight: 500 }}>{title}</div>
        {description && <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.75rem" }}>{description}</div>}
      </div>
    </div>
  );
}

export interface AccountChipProps {
  name: string;
  email?: string;
  avatarSrc?: string | null;
  /** Mostra il pulsante per usare un altro account */
  onChange?: () => void;
  changeLabel?: ReactNode;
  greeting?: (name: string) => ReactNode;
}

/** L'account ricordato sopra il modulo: "Ciao, Mario!" con avatar e Cambia */
export function AccountChip({ name, email, avatarSrc, onChange, changeLabel = "Cambia", greeting = (n) => `Ciao, ${n}!` }: AccountChipProps) {
  const initials = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", alignItems: "center", gap: "0.85rem", background: "rgba(255,255,255,0.05)", padding: "0.85rem 1.25rem", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "1.75rem" }}
    >
      <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#111", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(255,255,255,0.18)", flexShrink: 0, boxShadow: "0 0 12px rgba(0,0,0,0.5)" }}>
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarSrc} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: "1.15rem", fontWeight: 600, color: "#fff" }}>{initials}</span>
        )}
      </div>
      <div style={{ overflow: "hidden", flex: 1 }}>
        <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{greeting(name)}</div>
        {email && <div style={{ color: "rgba(255, 255, 255, 0.55)", fontSize: "0.78rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{email}</div>}
      </div>
      {onChange && (
        <button
          type="button"
          onClick={onChange}
          style={{ background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#eee", fontSize: "0.75rem", borderRadius: "999px", cursor: "pointer", padding: "4px 10px", transition: "all 0.15s ease" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.16)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
        >
          {changeLabel}
        </button>
      )}
    </motion.div>
  );
}

export interface AppRedirectChipProps {
  name: string;
  logo: string;
  label?: ReactNode;
}

/** Indica verso quale app si verrà reindirizzati dopo l'accesso */
export function AppRedirectChip({ name, logo, label = "Reindirizzamento verso" }: AppRedirectChipProps) {
  return (
    <div style={{ marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "rgba(255,255,255,0.06)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)", fontSize: "0.85rem", color: "#eee" }}>
      {/* Logo da 18px: un <img> normale, così il componente funziona anche fuori da Next.js */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt={name} width={18} height={18} style={{ objectFit: "contain" }} />
      <span>
        {label} <strong>{name}</strong>
      </span>
    </div>
  );
}

export interface FormFooterProps {
  text: ReactNode;
  linkLabel: ReactNode;
  href: ComponentProps<typeof Link>["href"];
}

/** Riga sotto il modulo, es. "Non hai ancora un account? Registrati gratis" */
export function FormFooter({ text, linkLabel, href }: FormFooterProps) {
  return (
    <div style={{ marginTop: "1.75rem", textAlign: "center", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.55)" }}>
      {text}{" "}
      <Link
        href={href}
        style={{ color: "#fff", fontWeight: 600, textDecoration: "none", transition: "color 0.15s ease" }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#ccc")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#fff")}
      >
        {linkLabel}
      </Link>
    </div>
  );
}

export interface ProfileHeroProps {
  name?: string | null;
  email?: string | null;
  avatarSrc?: string | null;
  /** Pallino verde "online" sull'avatar */
  online?: boolean;
}

/** Avatar grande con nome ed email, come nella panoramica vuota */
export function ProfileHero({ name, email, avatarSrc, online = true }: ProfileHeroProps) {
  return (
    <>
      <div style={{ position: "relative", marginBottom: "1.25rem" }}>
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarSrc} alt="Avatar" style={{ width: "88px", height: "88px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.18)", boxShadow: "0 16px 36px -10px rgba(0,0,0,0.6)" }} />
        ) : (
          <div style={{ width: "88px", height: "88px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))", border: "2px solid rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "2.2rem", color: "#fff", boxShadow: "0 16px 36px -10px rgba(0,0,0,0.6)" }}>
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
        {online && <span style={{ position: "absolute", bottom: "0px", right: "0px", width: "18px", height: "18px", borderRadius: "50%", background: "#4ade80", border: "3px solid #0d0e15" }} />}
      </div>
      <h1 style={{ fontSize: "1.85rem", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>{name || "Benvenuto in ticly"}</h1>
      <p style={{ fontSize: "0.95rem", color: "rgba(255, 255, 255, 0.6)", marginTop: "0.35rem", marginBottom: "2rem" }}>{email || "Account ticly"}</p>
    </>
  );
}
