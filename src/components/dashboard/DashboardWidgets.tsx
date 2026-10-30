"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Cpu,
  CreditCard,
  Download,
  LayoutGrid,
  Lock,
  NotebookPen,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { AI_MODELS, PLANS, hasTierAccess, type PlanId } from "../../lib/plans";
import type { DashboardWidgetConfig, WidgetSize } from "../../lib/dashboard-widgets";
import { APPLE_TINTS } from "./widget-meta";

export type DashboardTab = "panoramica" | "vantaggi" | "sicurezza" | "piani" | "profilo";

export interface WidgetUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  subscription?: string | null;
  profilePicture?: string | null;
  twoFactorEnabled?: boolean;
  recoveryEmail?: string | null;
  passkeys?: unknown[] | null;
  createdAt?: string | Date | null;
}

export interface WidgetSearchItem {
  id: string;
  title: string;
  category: string;
  action: () => void;
}

export interface WidgetApp {
  id: string;
  name: string;
  logo: string;
  url: string;
}

export interface WidgetContext {
  user: WidgetUser | null;
  now: Date;
  securityScore: number;
  tokens: { balance: number; monthly: number };
  apps: WidgetApp[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  searchResults: WidgetSearchItem[];
  searchSuggestions: WidgetSearchItem[];
  notes: string;
  onNotesChange: (value: string) => void;
  onNavigate: (tab: DashboardTab) => void;
  onManageBilling: () => void;
  onExportData: () => void;
}

/** Widget che si aprono con un clic su tutta la superficie */
export const PRESSABLE_WIDGETS = new Set(["security", "tokens"]);

// L'italiano di default non raggruppa le cifre sotto i 10.000 ("1500"): si forza "1.500"
const numberFormat = new Intl.NumberFormat("it-IT", { useGrouping: "always" } as Intl.NumberFormatOptions);
const formatNumber = (value: number) => numberFormat.format(value);

export function WidgetContent({ widget, ctx }: { widget: DashboardWidgetConfig; ctx: WidgetContext }) {
  switch (widget.id) {
    case "identity":
      return <IdentityWidget size={widget.size} ctx={ctx} />;
    case "search":
      return <SearchWidget ctx={ctx} />;
    case "security":
      return <SecurityWidget size={widget.size} ctx={ctx} />;
    case "tokens":
      return <TokensWidget size={widget.size} ctx={ctx} />;
    case "role":
      return <RoleWidget ctx={ctx} />;
    case "actions":
      return <ActionsWidget size={widget.size} ctx={ctx} />;
    case "apps":
      return <AppsWidget size={widget.size} ctx={ctx} />;
    case "scratchpad":
      return <NotesWidget ctx={ctx} />;
    case "aiModels":
      return <ModelsWidget size={widget.size} ctx={ctx} />;
    case "sessionInfo":
      return <SessionWidget />;
    default:
      return null;
  }
}

/* ── Primitive condivise ── */

function WidgetHeader({
  icon: Icon,
  title,
  tint,
  trailing,
}: {
  icon: LucideIcon;
  title: string;
  tint: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="wg-head">
      <Icon size={14} strokeWidth={2.4} color={tint} />
      <span style={{ color: tint }}>{title}</span>
      {trailing && <span className="wg-head-trailing">{trailing}</span>}
    </div>
  );
}

function Pressable({
  label,
  onActivate,
  className = "",
  children,
}: {
  label: string;
  onActivate: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      className={`wg wg-pressable ${className}`}
      onClick={onActivate}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
    >
      {children}
    </div>
  );
}

function Ring({ value, size, stroke = 7, color, children }: { value: number; size: number; stroke?: number; color: string; children?: ReactNode }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value)) / 100;
  return (
    <div className="wg-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="wg-ring-progress"
        />
      </svg>
      <div className="wg-ring-center">{children}</div>
    </div>
  );
}

function Avatar({ user, size }: { user: WidgetUser | null; size: number }) {
  if (user?.profilePicture) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.profilePicture} alt="" className="wg-avatar" style={{ width: size, height: size }} />;
  }
  const initials = (user?.name || user?.email || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return (
    <span className="wg-avatar wg-monogram" style={{ width: size, height: size, fontSize: size * 0.4 }} aria-hidden="true">
      {initials}
    </span>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  return (
    <button
      type="button"
      className={`wg-icon-btn ${copied ? "is-done" : ""}`}
      aria-label={copied ? "Copiato" : label}
      title={copied ? "Copiato" : label}
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(value);
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={2.2} />}
    </button>
  );
}

/* ── Account ── */

function IdentityWidget({ size, ctx }: { size: WidgetSize; ctx: WidgetContext }) {
  const { user } = ctx;
  const plan = PLANS[(user?.subscription || "FREE").toUpperCase() as PlanId];
  const planName = plan?.name ?? "Free";
  const since = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("it-IT", { month: "long", year: "numeric" })
    : null;
  const name = user?.name || "Il tuo account";
  const email = user?.email || "";

  if (size === "1x") {
    return (
      <div className="wg">
        <div className="wg-row-top">
          <Avatar user={user} size={46} />
          <span className="wg-plan-text">{planName}</span>
        </div>
        <div className="wg-push">
          <div className="wg-title-lg wg-ellipsis">{name}</div>
          <div className="wg-secondary wg-ellipsis">{email}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="wg wg-split">
      <div className="wg-split-main">
        <Avatar user={user} size={52} />
        <div className="wg-push">
          <div className="wg-title-lg wg-ellipsis">{name}</div>
          <div className="wg-secondary wg-ellipsis">{email}</div>
        </div>
      </div>
      <dl className="wg-facts wg-split-side">
        <div>
          <dt>Piano</dt>
          <dd>{planName}</dd>
        </div>
        {since && (
          <div>
            <dt>Membro da</dt>
            <dd style={{ textTransform: "capitalize" }}>{since}</dd>
          </div>
        )}
        <div>
          <dt>ID account</dt>
          <dd>
            <span className="wg-mono wg-ellipsis">{user?.id ? user.id.slice(0, 12) : "—"}</span>
            {user?.id && <CopyButton value={user.id} label="Copia ID account" />}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/* ── Ricerca (stile Spotlight) ── */

function SearchWidget({ ctx }: { ctx: WidgetContext }) {
  const query = ctx.searchQuery;
  const hasQuery = query.trim().length > 0;
  const items = (hasQuery ? ctx.searchResults : ctx.searchSuggestions).slice(0, 3);

  return (
    <div className="wg">
      <label className="wg-search-field">
        <Search size={16} strokeWidth={2.2} />
        <input
          type="text"
          value={query}
          onChange={(e) => ctx.onSearchQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && items[0]) items[0].action();
            if (e.key === "Escape" && query) {
              e.stopPropagation();
              ctx.onSearchQueryChange("");
            }
          }}
          placeholder="Cerca in ticly"
          aria-label="Cerca in ticly"
        />
        {query && (
          <button type="button" className="wg-search-clear" onClick={() => ctx.onSearchQueryChange("")} aria-label="Cancella ricerca">
            <X size={10} strokeWidth={3.4} />
          </button>
        )}
      </label>
      <div className="wg-caption">{hasQuery ? (items.length ? "Risultati migliori" : "") : "Suggerimenti"}</div>
      {items.length > 0 ? (
        <ul className="wg-results">
          {items.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={item.action}>
                <span className="wg-result-title">{item.title}</span>
                <span className="wg-result-meta">{item.category}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="wg-secondary wg-empty-text">Nessun risultato per «{query.trim()}»</div>
      )}
    </div>
  );
}

/* ── Sicurezza ── */

function SecurityWidget({ size, ctx }: { size: WidgetSize; ctx: WidgetContext }) {
  const { user, securityScore } = ctx;
  const status =
    securityScore >= 80
      ? { label: "Ottima", color: APPLE_TINTS.green }
      : securityScore >= 55
        ? { label: "Buona", color: APPLE_TINTS.yellow }
        : { label: "Da migliorare", color: APPLE_TINTS.orange };
  const checks = [
    { label: "Verifica in due passaggi", ok: !!user?.twoFactorEnabled },
    { label: "Passkey", ok: (user?.passkeys?.length ?? 0) > 0 },
    { label: "Email di recupero", ok: !!user?.recoveryEmail },
  ];
  const activeCount = checks.filter((c) => c.ok).length;
  const nextStep = checks.find((c) => !c.ok);

  return (
    <Pressable label="Apri le impostazioni di sicurezza" onActivate={() => ctx.onNavigate("sicurezza")}>
      <WidgetHeader icon={ShieldCheck} title="Sicurezza" tint={status.color} />
      <div className="wg-security">
        <Ring value={securityScore} size={size === "1x" ? 76 : 84} color={status.color}>
          <span className="wg-ring-value">
            {securityScore}
            <small>%</small>
          </span>
        </Ring>
        <div className="wg-security-text">
          <div className="wg-title-lg">{status.label}</div>
          <div className="wg-secondary">{activeCount} di 3 protezioni attive</div>
          {size === "1x" && nextStep && <div className="wg-tertiary wg-clamp-2">Suggerito: {nextStep.label.toLowerCase()}</div>}
        </div>
        {size !== "1x" && (
          <ul className="wg-checklist">
            {checks.map((check) => (
              <li key={check.label} className={check.ok ? "is-ok" : ""}>
                <span className="wg-check" aria-hidden="true">
                  {check.ok && <Check size={11} strokeWidth={3.4} />}
                </span>
                <span className="wg-ellipsis">{check.label}</span>
                <span className="sr-only">{check.ok ? "attiva" : "non attiva"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Pressable>
  );
}

/* ── Token AI ── */

function TokensWidget({ size, ctx }: { size: WidgetSize; ctx: WidgetContext }) {
  const { balance, monthly } = ctx.tokens;
  const remaining = monthly > 0 ? Math.max(0, Math.min(100, Math.round((balance / monthly) * 100))) : 0;
  const renewal = new Date(ctx.now.getFullYear(), ctx.now.getMonth() + 1, 1).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
  });
  const color = remaining <= 10 ? APPLE_TINTS.orange : APPLE_TINTS.purple;

  return (
    <Pressable label="Vedi piani e token" onActivate={() => ctx.onNavigate("piani")} className={size !== "1x" ? "wg-tokens-wide" : ""}>
      <WidgetHeader icon={Sparkles} title="Token AI" tint={APPLE_TINTS.purple} />
      <div className="wg-push">
        <div className="wg-hero">{formatNumber(balance)}</div>
        <div className="wg-secondary">disponibili su {formatNumber(monthly)}</div>
        <div className="wg-meter" role="meter" aria-valuenow={remaining} aria-valuemin={0} aria-valuemax={100} aria-label="Token disponibili">
          <span style={{ width: `${remaining}%`, background: `linear-gradient(90deg, ${color}cc, ${color})` }} />
        </div>
        <div className="wg-meter-legend">
          <span>Si rinnova il {renewal}</span>
          <span>{remaining}%</span>
        </div>
      </div>
    </Pressable>
  );
}

/* ── Accesso ── */

function RoleWidget({ ctx }: { ctx: WidgetContext }) {
  const isAdmin = ctx.user?.role === "ADMIN";
  return (
    <div className="wg">
      <WidgetHeader
        icon={UserRound}
        title="Accesso"
        tint={APPLE_TINTS.indigo}
        trailing={
          isAdmin ? (
            <Link href="/admin" className="wg-link">
              Console
              <ArrowUpRight size={12} strokeWidth={2.4} />
            </Link>
          ) : undefined
        }
      />
      <div className="wg-push">
        <div className="wg-title-xl">{isAdmin ? "Amministratore" : "Utente"}</div>
        <div className="wg-secondary wg-clamp-2" style={{ marginTop: 4 }}>
          {isAdmin
            ? "Gestione completa di utenti, servizi e registri di audit."
            : "Un unico accesso protetto per tutte le app ticly."}
        </div>
      </div>
    </div>
  );
}

/* ── Azioni rapide (stile Comandi Rapidi) ── */

function ActionsWidget({ size, ctx }: { size: WidgetSize; ctx: WidgetContext }) {
  const actions = [
    { id: "billing", label: "Abbonamento", icon: CreditCard, tint: APPLE_TINTS.green, onClick: ctx.onManageBilling },
    { id: "profile", label: "Profilo", icon: UserRound, tint: APPLE_TINTS.blue, onClick: () => ctx.onNavigate("profilo") },
    { id: "security", label: "Sicurezza", icon: Lock, tint: APPLE_TINTS.orange, onClick: () => ctx.onNavigate("sicurezza") },
    { id: "export", label: "Esporta dati", icon: Download, tint: APPLE_TINTS.purple, onClick: ctx.onExportData },
  ];
  return (
    <div className={`wg wg-actions ${size === "1x" ? "cols-2" : "cols-4"}`}>
      {actions.map((action) => (
        <button key={action.id} type="button" className="wg-action" onClick={action.onClick}>
          <span className="wg-action-icon" style={{ background: action.tint }}>
            <action.icon size={15} strokeWidth={2.3} />
          </span>
          <span className="wg-action-label">{action.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ── App ticly ── */

function AppsWidget({ size, ctx }: { size: WidgetSize; ctx: WidgetContext }) {
  const apps = ctx.apps.slice(0, size === "1x" ? 4 : 5);
  return (
    <div className="wg">
      <WidgetHeader icon={LayoutGrid} title="App ticly" tint="rgba(235,235,245,0.6)" />
      <div className={`wg-apps ${size === "1x" ? "cols-2" : "cols-5"}`}>
        {apps.map((app) => (
          <Link key={app.id} href={app.url} className="wg-app" aria-label={`Apri ${app.name}`} title={app.name}>
            <Image src={app.logo} alt={app.name} width={160} height={44} />
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Note ── */

function NotesWidget({ ctx }: { ctx: WidgetContext }) {
  return (
    <div className="wg">
      <WidgetHeader
        icon={NotebookPen}
        title="Note"
        tint={APPLE_TINTS.yellow}
        trailing={ctx.notes ? <CopyButton value={ctx.notes} label="Copia note" /> : undefined}
      />
      <textarea
        className="wg-notes-input"
        value={ctx.notes}
        onChange={(e) => ctx.onNotesChange(e.target.value)}
        placeholder="Scrivi una nota…"
        aria-label="Note"
      />
    </div>
  );
}

/* ── Modelli AI (elenco in stile Borsa) ── */

function ModelsWidget({ size, ctx }: { size: WidgetSize; ctx: WidgetContext }) {
  const available = AI_MODELS.filter((m) => hasTierAccess(ctx.user?.subscription, m.minPlan));
  const columns = size === "1x" ? 1 : size === "2x" ? 2 : 3;
  const shown = available.slice(0, columns * 3);
  return (
    <div className="wg">
      <WidgetHeader
        icon={Cpu}
        title="Modelli AI"
        tint={APPLE_TINTS.pink}
        trailing={<span>{available.length} disponibili</span>}
      />
      <ul className={`wg-list cols-${columns}`}>
        {shown.map((model) => (
          <li key={model.id}>
            <span className="wg-list-title">{model.name.replace(/\s*\(.*?\)\s*/g, " ").trim()}</span>
            <span className="wg-list-meta">{model.provider}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Sessione ── */

const subscribeNoop = () => () => {};

function describeDevice(userAgent: string) {
  const browser = /Edg\//.test(userAgent)
    ? "Edge"
    : /OPR\//.test(userAgent)
      ? "Opera"
      : /Firefox\//.test(userAgent)
        ? "Firefox"
        : /Chrome\//.test(userAgent)
          ? "Chrome"
          : /Safari\//.test(userAgent)
            ? "Safari"
            : "Browser";
  const os = /iPhone/.test(userAgent)
    ? "iOS"
    : /iPad/.test(userAgent)
      ? "iPadOS"
      : /Android/.test(userAgent)
        ? "Android"
        : /Mac OS X/.test(userAgent)
          ? "macOS"
          : /Windows/.test(userAgent)
            ? "Windows"
            : /Linux/.test(userAgent)
              ? "Linux"
              : "";
  return os ? `${browser} su ${os}` : browser;
}

function SessionWidget() {
  const device = useSyncExternalStore(
    subscribeNoop,
    () => describeDevice(navigator.userAgent),
    () => "Questo dispositivo"
  );
  return (
    <div className="wg">
      <WidgetHeader icon={Lock} title="Sessione" tint={APPLE_TINTS.teal} />
      <dl className="wg-facts wg-push">
        <div>
          <dt>Dispositivo</dt>
          <dd className="wg-ellipsis">{device}</dd>
        </div>
        <div>
          <dt>Cifratura</dt>
          <dd>AES-256-GCM</dd>
        </div>
        <div>
          <dt>Autenticazione</dt>
          <dd>WebAuthn</dd>
        </div>
      </dl>
    </div>
  );
}
