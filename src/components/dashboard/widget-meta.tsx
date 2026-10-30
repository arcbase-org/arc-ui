import {
  Cpu,
  Lock,
  NotebookPen,
  Search,
  ShieldCheck,
  Sparkles,
  SquareUserRound,
  UserRound,
  Zap,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

/* Colori di sistema Apple (variante dark) usati come tinta di ogni widget */
export const APPLE_TINTS = {
  blue: "#0A84FF",
  green: "#30D158",
  indigo: "#5E5CE6",
  orange: "#FF9F0A",
  pink: "#FF375F",
  purple: "#BF5AF2",
  red: "#FF453A",
  teal: "#40C8E0",
  yellow: "#FFD60A",
  gray: "#8E8E93",
} as const;

export const WIDGET_ICONS: Record<string, LucideIcon> = {
  identity: SquareUserRound,
  search: Search,
  security: ShieldCheck,
  tokens: Sparkles,
  role: UserRound,
  actions: Zap,
  apps: LayoutGrid,
  scratchpad: NotebookPen,
  aiModels: Cpu,
  sessionInfo: Lock,
};

export const WIDGET_TINTS: Record<string, string> = {
  identity: APPLE_TINTS.blue,
  search: APPLE_TINTS.gray,
  security: APPLE_TINTS.green,
  tokens: APPLE_TINTS.purple,
  role: APPLE_TINTS.indigo,
  actions: APPLE_TINTS.orange,
  apps: APPLE_TINTS.teal,
  scratchpad: APPLE_TINTS.yellow,
  aiModels: APPLE_TINTS.pink,
  sessionInfo: APPLE_TINTS.teal,
};

/** Icona del widget su "squircle" colorato, come nelle Impostazioni di iOS */
export function WidgetSquircle({ id, size = 28 }: { id: string; size?: number }) {
  const Icon = WIDGET_ICONS[id] ?? Sparkles;
  return (
    <span
      className="wc-squircle"
      style={{ width: size, height: size, background: WIDGET_TINTS[id] ?? APPLE_TINTS.gray }}
      aria-hidden="true"
    >
      <Icon size={Math.round(size * 0.56)} strokeWidth={2.2} />
    </span>
  );
}
