// Liste di login.ticly.it, con il "corner game" degli angoli:
// - "stack": elenco delle sezioni Vantaggi, Sicurezza, Piani e Profilo (`.accordion-stack-*`)
// - "compact": elenco dei risultati di ricerca (`.search-result-item`)
// Ogni riga può essere statica, cliccabile o a fisarmonica (se ha contenuto).
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cx } from "../lib/cx";

export type ListVariant = "stack" | "compact";

const ListContext = createContext<ListVariant>("stack");

export type ListProps = ComponentProps<"div"> & {
  /** "stack": righe grandi (sezioni della dashboard); "compact": righe piccole (risultati di ricerca) */
  variant?: ListVariant;
};

/** Elenco di righe connesse: angoli esterni grandi, interni piccoli */
export function List({ variant = "stack", className, ...props }: ListProps) {
  return (
    <ListContext.Provider value={variant}>
      <div className={cx(variant === "compact" ? "search-results-group" : "accordion-stack-group", className)} {...props} />
    </ListContext.Provider>
  );
}

/** Colore del bordo per piano, come nella sezione Piani (solo variante "stack") */
export type ListItemTone = "pro" | "mega" | "ultra";

export interface ListItemProps {
  title: ReactNode;
  /** Etichetta maiuscola accanto al titolo */
  category?: ReactNode;
  /** Riga sotto il titolo; nelle righe a fisarmonica si vede solo da chiuse */
  description?: ReactNode;
  icon?: ReactNode;
  /** Numero a sinistra, es. "01" (come nei Vantaggi) */
  index?: ReactNode;
  /** Blocco prima del titolo, es. <Price /> (come nei Piani) */
  leading?: ReactNode;
  /** Etichette accanto al titolo, es. <Tag /> */
  badges?: ReactNode;
  /** A destra: un testo (es. "Hi-Fi FLAC") o un elemento (es. StatusPill, Button) */
  trailing?: ReactNode;
  tone?: ListItemTone;
  /** Evidenzia la riga, come il piano attivo */
  highlighted?: boolean;
  /** Riga cliccabile */
  onClick?: () => void;
  /** Riga che è un link */
  href?: string;
  target?: string;
  rel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Contenuto che si apre sotto la riga: con questo la riga diventa una fisarmonica */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

// I clic su bottoni e link dentro la riga non devono aprire o chiudere la fisarmonica
const fromNestedControl = (target: EventTarget, row: HTMLElement) => {
  const control = (target as HTMLElement).closest("button, a, input, select, textarea, label");
  return control !== null && control !== row;
};

/** Riga di una List */
export function ListItem({
  title,
  category,
  description,
  icon,
  index,
  leading,
  badges,
  trailing,
  tone,
  highlighted,
  onClick,
  href,
  target,
  rel,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
  style,
}: ListItemProps) {
  const variant = useContext(ListContext);
  const compact = variant === "compact";
  const expandable = children !== undefined && children !== null && children !== false;
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const isOpen = expandable && (open ?? innerOpen);
  const interactive = expandable || !!onClick;
  const numbered = index !== undefined && index !== null;

  const activate = () => {
    if (expandable) {
      if (open === undefined) setInnerOpen(!isOpen);
      onOpenChange?.(!isOpen);
    }
    onClick?.();
  };

  const onRowClick = (e: MouseEvent<HTMLElement>) => {
    if (fromNestedControl(e.target, e.currentTarget)) return;
    activate();
  };

  const onRowKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate();
    }
  };

  const titleSize = compact ? "0.85rem" : leading ? "1.1rem" : numbered ? "0.98rem" : "1rem";

  const content = (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: compact ? "10px" : leading ? "1.25rem" : "14px", minWidth: 0, flex: 1 }}>
        {numbered && <span style={{ fontSize: "0.75rem", color: "#555", fontWeight: 700, fontFamily: "ui-monospace, monospace", width: "18px", flexShrink: 0 }}>{index}</span>}
        {leading}
        {icon && <span style={{ color: "#bbb", display: "inline-flex", alignItems: "center", flexShrink: 0, ...(compact ? { fontSize: "1.1rem" } : null) }}>{icon}</span>}
        <div style={{ textAlign: "left", minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: titleSize, fontWeight: compact ? 600 : 700, color: "#fff" }}>{title}</span>
            {category && <span style={{ fontSize: "0.68rem", color: "#777", textTransform: "uppercase", letterSpacing: "0.05em" }}>{category}</span>}
            {badges}
          </div>
          {description && !isOpen && (
            <div
              style={
                compact
                  ? { fontSize: "0.72rem", color: "#888" }
                  : { fontSize: "0.8rem", color: "#666", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
              }
            >
              {description}
            </div>
          )}
        </div>
      </div>

      {(trailing !== undefined || expandable || href || onClick) && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          {typeof trailing === "string" ? <span style={{ fontSize: "0.74rem", fontWeight: 500, color: "#888" }}>{trailing}</span> : trailing}
          {expandable ? (
            <div style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)", color: "#666", display: "flex", alignItems: "center" }}>
              <ChevronDown size={compact ? 16 : 18} />
            </div>
          ) : href ? (
            <ArrowUpRight size={compact ? 14 : 16} style={{ color: "#888" }} />
          ) : onClick ? (
            <ChevronRight size={compact ? 16 : 18} style={{ color: "#666" }} />
          ) : null}
        </div>
      )}
    </>
  );

  // Riga: la stessa struttura in entrambe le varianti, cambiano solo misure e classi
  const rowClass = compact ? undefined : "accordion-stack-trigger";
  const rowStyle: CSSProperties = compact
    ? { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "10px 14px", width: "100%", color: "inherit", textDecoration: "none", cursor: href || interactive ? "pointer" : "default" }
    : { cursor: href || interactive ? "pointer" : "default", textDecoration: "none" };

  const row = href ? (
    <a href={href} target={target} rel={rel} className={rowClass} style={rowStyle} onClick={onClick}>
      {content}
    </a>
  ) : interactive ? (
    <div role="button" tabIndex={0} aria-expanded={expandable ? isOpen : undefined} className={rowClass} style={rowStyle} onClick={onRowClick} onKeyDown={onRowKeyDown}>
      {content}
    </div>
  ) : (
    <div className={rowClass} style={rowStyle}>
      {content}
    </div>
  );

  const body = expandable && (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {compact ? (
            <div style={{ padding: "0 14px 12px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>{children}</div>
          ) : (
            <div className="accordion-stack-body">{children}</div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (compact) {
    return (
      <div
        className={cx("search-result-item", className)}
        style={{ flexDirection: "column", alignItems: "stretch", padding: 0, ...(href || interactive ? null : { cursor: "default" }), ...style }}
      >
        {row}
        {body}
      </div>
    );
  }

  return (
    <div className={cx("accordion-stack-item", tone && `tier-${tone}`, isOpen && "is-expanded", highlighted && "is-active-tier", className)} style={style}>
      {row}
      {body}
    </div>
  );
}

export interface PriceProps {
  value: ReactNode;
  period?: ReactNode;
}

/** Prezzo in evidenza a sinistra di una riga, come nei Piani */
export function Price({ value, period = "/mese" }: PriceProps) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", minWidth: "125px", flexShrink: 0 }}>
      <span style={{ fontSize: "1.85rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</span>
      {period && <span style={{ fontSize: "0.78rem", color: "#666", marginLeft: "4px" }}>{period}</span>}
    </div>
  );
}

const TAG_TONES = {
  // "Consigliato"
  neutral: { color: "#ccc", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", fontSize: "0.68rem" },
  // "Potenza 5x"
  gold: { color: "#fcd34d", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.18)", borderRadius: "4px", fontSize: "0.68rem" },
  // "Top di Gamma"
  white: { color: "#fff", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", fontSize: "0.68rem" },
  // "Piano Attivo"
  success: { color: "#4ade80", background: "rgba(74, 222, 128, 0.1)", border: "1px solid rgba(74, 222, 128, 0.2)", borderRadius: "999px", fontSize: "0.66rem" },
} satisfies Record<string, CSSProperties>;

export interface TagProps {
  tone?: keyof typeof TAG_TONES;
  children: ReactNode;
}

/** Piccola etichetta accanto al titolo, es. "Consigliato" o "Piano Attivo" */
export function Tag({ tone = "neutral", children }: TagProps) {
  return <span style={{ ...TAG_TONES[tone], fontWeight: 600, padding: "1px 7px" }}>{children}</span>;
}

/** Paragrafo descrittivo dentro una riga aperta */
export function AccordionText({ style, ...props }: ComponentProps<"p">) {
  return <p style={{ color: "#aaa", fontSize: "0.85rem", lineHeight: 1.6, marginTop: "0.75rem", marginBottom: "1.25rem", ...style }} {...props} />;
}

export interface CheckListProps {
  items: ReactNode[];
}

/** Elenco puntato con le spunte, come i dettagli dei Vantaggi */
export function CheckList({ items }: CheckListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "#ccc" }}>
          <Check size={14} style={{ flexShrink: 0, color: "#a1a1aa" }} />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export interface AccordionFooterProps {
  /** Testo a sinistra, es. "Stato: Hi-Fi FLAC" */
  status?: ReactNode;
  statusLabel?: ReactNode;
  /** Azioni a destra */
  children?: ReactNode;
}

/** Riga finale di una riga aperta, con stato e azione */
export function AccordionFooter({ status, statusLabel = "Stato", children }: AccordionFooterProps) {
  return (
    <div style={{ display: "flex", justifyContent: status !== undefined ? "space-between" : "flex-end", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      {status !== undefined && (
        <span style={{ fontSize: "0.75rem", color: "#666" }}>
          {statusLabel}: <strong style={{ color: "#eee" }}>{status}</strong>
        </span>
      )}
      {children}
    </div>
  );
}

/** Colonna di ListRow */
export function ListRowGroup({ style, ...props }: ComponentProps<"div">) {
  return <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1.25rem", ...style }} {...props} />;
}

export interface ListRowProps {
  icon?: LucideIcon;
  title: ReactNode;
  /** Testo monospazio accanto al titolo, es. "#a1b2c3d4" */
  meta?: ReactNode;
  subtitle?: ReactNode;
  /** A destra, es. Button variant="danger" size="sm" */
  action?: ReactNode;
}

/** Riga di un elenco di dispositivi o chiavi, come le Passkey */
export function ListRow({ icon: Icon, title, meta, subtitle, action }: ListRowProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255, 255, 255, 0.025)", border: "1px solid rgba(255, 255, 255, 0.07)", padding: "0.85rem 1.15rem", borderRadius: "12px", flexWrap: "wrap", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {Icon && <Icon size={18} style={{ color: "#a1a1aa" }} />}
        <div>
          <div style={{ color: "#eee", fontWeight: 600, fontSize: "0.88rem" }}>
            {title} {meta && <span style={{ fontFamily: "ui-monospace, monospace", color: "#888", fontSize: "0.8rem" }}>{meta}</span>}
          </div>
          {subtitle && <div style={{ color: "#777", fontSize: "0.74rem", marginTop: "2px" }}>{subtitle}</div>}
        </div>
      </div>
      {action}
    </div>
  );
}

/** Riquadro tratteggiato per un elenco vuoto */
export function ListEmpty({ style, ...props }: ComponentProps<"div">) {
  return <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px dashed rgba(255, 255, 255, 0.1)", padding: "1.25rem", borderRadius: "12px", textAlign: "center", color: "#888", fontSize: "0.82rem", marginBottom: "1.25rem", ...style }} {...props} />;
}

export interface DetailRowProps {
  label: ReactNode;
  value: ReactNode;
}

/** Riga etichetta/valore con separatore (`.m3-list-item`) */
export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="m3-list-item">
      <span className="m3-list-label">{label}</span>
      <span className="m3-list-value">{value}</span>
    </div>
  );
}

export interface MetricProps {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
}

/** Numero grande con etichetta (`.m3-label`, `.m3-value`, `.m3-sub`) */
export function Metric({ label, value, sub }: MetricProps) {
  return (
    <div>
      <div className="m3-label">{label}</div>
      <div className="m3-value">{value}</div>
      {sub && <div className="m3-sub">{sub}</div>}
    </div>
  );
}
