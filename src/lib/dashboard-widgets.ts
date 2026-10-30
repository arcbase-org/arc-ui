export type WidgetSize = "1x" | "2x" | "full";

export type WidgetCategory = "Account" | "AI & Strumenti" | "Sicurezza" | "Produttività";

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  subtitle: string;
  category: WidgetCategory;
  size: WidgetSize;
  enabled: boolean;
  order: number;
}

export const WIDGETS_STORAGE_KEY = "ticly_dashboard_custom_widgets_v3";
export const WIDGETS_CONFIGURED_KEY = "ticly_has_configured_widgets_v1";

export const WIDGET_CATEGORIES: WidgetCategory[] = ["Account", "Sicurezza", "AI & Strumenti", "Produttività"];

export const WIDGET_SIZES: WidgetSize[] = ["1x", "2x", "full"];

export const WIDGET_SIZE_META: Record<WidgetSize, { short: string; label: string; detail: string }> = {
  "1x": { short: "S", label: "Piccolo", detail: "1 colonna" },
  "2x": { short: "M", label: "Medio", detail: "2 colonne" },
  full: { short: "L", label: "Grande", detail: "Riga intera" },
};

// Il layout predefinito riempie la griglia a 3 colonne senza buchi:
// [identity ▪▪][security ▪] · [tokens ▪][search ▪▪] · [role ▪][actions ▪▪] · [apps ▪▪▪]
export const DEFAULT_DASHBOARD_WIDGETS: DashboardWidgetConfig[] = [
  {
    id: "identity",
    title: "Account",
    subtitle: "Profilo, piano e ID account",
    category: "Account",
    size: "2x",
    enabled: true,
    order: 1,
  },
  {
    id: "security",
    title: "Sicurezza",
    subtitle: "Verifica in due passaggi, passkey e recupero",
    category: "Sicurezza",
    size: "1x",
    enabled: true,
    order: 2,
  },
  {
    id: "tokens",
    title: "Token AI",
    subtitle: "Saldo mensile e rinnovo",
    category: "AI & Strumenti",
    size: "1x",
    enabled: true,
    order: 3,
  },
  {
    id: "search",
    title: "Ricerca",
    subtitle: "Trova impostazioni, app e azioni",
    category: "Produttività",
    size: "2x",
    enabled: true,
    order: 4,
  },
  {
    id: "role",
    title: "Accesso",
    subtitle: "Ruolo e privilegi nel workspace",
    category: "Account",
    size: "1x",
    enabled: true,
    order: 5,
  },
  {
    id: "actions",
    title: "Azioni rapide",
    subtitle: "Abbonamento, profilo ed esportazione dati",
    category: "Account",
    size: "2x",
    enabled: true,
    order: 6,
  },
  {
    id: "apps",
    title: "App ticly",
    subtitle: "Apri le app con un solo accesso",
    category: "Produttività",
    size: "full",
    enabled: true,
    order: 7,
  },
  {
    id: "scratchpad",
    title: "Note",
    subtitle: "Appunti salvati su questo dispositivo",
    category: "Produttività",
    size: "1x",
    enabled: false,
    order: 8,
  },
  {
    id: "aiModels",
    title: "Modelli AI",
    subtitle: "Modelli inclusi nel tuo piano",
    category: "AI & Strumenti",
    size: "2x",
    enabled: false,
    order: 9,
  },
  {
    id: "sessionInfo",
    title: "Sessione",
    subtitle: "Dispositivo e protezione della connessione",
    category: "Sicurezza",
    size: "1x",
    enabled: false,
    order: 10,
  },
];

export interface WidgetPreset {
  id: "default" | "ai" | "security" | "minimal";
  name: string;
  description: string;
  layout: Array<{ id: string; size: WidgetSize }>;
}

export const WIDGET_PRESETS: WidgetPreset[] = [
  {
    id: "default",
    name: "Bilanciato",
    description: "Account, sicurezza e servizi",
    layout: DEFAULT_DASHBOARD_WIDGETS.filter((w) => w.enabled).map((w) => ({ id: w.id, size: w.size })),
  },
  {
    id: "ai",
    name: "Focus AI",
    description: "Token, modelli e note",
    layout: [
      { id: "tokens", size: "1x" },
      { id: "aiModels", size: "2x" },
      { id: "identity", size: "2x" },
      { id: "scratchpad", size: "1x" },
      { id: "apps", size: "full" },
      { id: "actions", size: "full" },
    ],
  },
  {
    id: "security",
    name: "Sicurezza",
    description: "2FA, sessione e ruolo",
    layout: [
      { id: "security", size: "2x" },
      { id: "sessionInfo", size: "1x" },
      { id: "role", size: "1x" },
      { id: "identity", size: "2x" },
      { id: "actions", size: "full" },
      { id: "apps", size: "full" },
    ],
  },
  {
    id: "minimal",
    name: "Essenziale",
    description: "Solo l'indispensabile",
    layout: [
      { id: "identity", size: "2x" },
      { id: "tokens", size: "1x" },
      { id: "actions", size: "full" },
    ],
  },
];

const isWidgetSize = (value: unknown): value is WidgetSize =>
  value === "1x" || value === "2x" || value === "full";

/** Ordina i widget attivi per posizione. */
export function getActiveWidgets(widgets: DashboardWidgetConfig[]): DashboardWidgetConfig[] {
  return widgets.filter((w) => w.enabled).sort((a, b) => a.order - b.order);
}

/**
 * Unisce una configurazione salvata con il catalogo corrente: i widget nuovi compaiono
 * (disattivati), quelli rimossi dal catalogo spariscono, titoli e categorie restano
 * aggiornati e gli ordini vengono rinumerati senza duplicati.
 */
export function normalizeWidgets(saved: unknown): DashboardWidgetConfig[] {
  if (!Array.isArray(saved)) return DEFAULT_DASHBOARD_WIDGETS;

  const savedById = new Map<string, Partial<DashboardWidgetConfig>>();
  for (const item of saved) {
    if (item && typeof item === "object" && typeof (item as DashboardWidgetConfig).id === "string") {
      savedById.set((item as DashboardWidgetConfig).id, item as Partial<DashboardWidgetConfig>);
    }
  }

  const merged = DEFAULT_DASHBOARD_WIDGETS.map((def, index) => {
    const s = savedById.get(def.id);
    if (!s) return { widget: { ...def, enabled: false }, rank: Number.MAX_SAFE_INTEGER, index };
    return {
      widget: {
        ...def,
        enabled: typeof s.enabled === "boolean" ? s.enabled : def.enabled,
        size: isWidgetSize(s.size) ? s.size : def.size,
      },
      rank: typeof s.order === "number" && Number.isFinite(s.order) ? s.order : Number.MAX_SAFE_INTEGER,
      index,
    };
  });

  return merged
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ widget }, i) => ({ ...widget, order: i + 1 }));
}

/** Applica un nuovo ordine ai widget attivi, lasciando gli altri in coda. */
export function withActiveOrder(
  widgets: DashboardWidgetConfig[],
  orderedActiveIds: string[]
): DashboardWidgetConfig[] {
  const position = new Map(orderedActiveIds.map((id, i) => [id, i + 1]));
  const tailStart = orderedActiveIds.length;
  let tail = 0;
  return widgets.map((w) => {
    const pos = position.get(w.id);
    if (pos !== undefined) return { ...w, order: pos };
    tail += 1;
    return { ...w, order: tailStart + tail };
  });
}

export function moveInArray<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function buildPresetWidgets(presetId: WidgetPreset["id"]): DashboardWidgetConfig[] {
  const preset = WIDGET_PRESETS.find((p) => p.id === presetId);
  if (!preset) return DEFAULT_DASHBOARD_WIDGETS;
  const layoutIndex = new Map(preset.layout.map((item, i) => [item.id, { ...item, order: i + 1 }]));
  let tail = preset.layout.length;
  return DEFAULT_DASHBOARD_WIDGETS.map((w) => {
    const entry = layoutIndex.get(w.id);
    if (entry) return { ...w, enabled: true, size: entry.size, order: entry.order };
    tail += 1;
    return { ...w, enabled: false, order: tail };
  });
}

/** Firma compatta del layout visibile, usata per confronti (undo, preset attivo). */
export function layoutSignature(widgets: DashboardWidgetConfig[]): string {
  return getActiveWidgets(widgets)
    .map((w) => `${w.id}:${w.size}`)
    .join("|");
}

export function presetSignature(preset: WidgetPreset): string {
  return preset.layout.map((item) => `${item.id}:${item.size}`).join("|");
}

export function loadStoredWidgets(): DashboardWidgetConfig[] {
  if (typeof window === "undefined") return DEFAULT_DASHBOARD_WIDGETS;
  try {
    if (localStorage.getItem(WIDGETS_CONFIGURED_KEY) === "false") {
      return DEFAULT_DASHBOARD_WIDGETS.map((w) => ({ ...w, enabled: false }));
    }
    const saved = localStorage.getItem(WIDGETS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return normalizeWidgets(parsed);
    }
  } catch {}
  return DEFAULT_DASHBOARD_WIDGETS;
}

export function persistWidgets(widgets: DashboardWidgetConfig[]) {
  try {
    localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(widgets));
  } catch {}
}
