// Documentazione di arc UI: ogni anteprima usa i componenti veri della libreria
import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight, Bell, CreditCard, Download, ExternalLink, Globe, Key, KeyRound, Laptop, LayoutDashboard,
  LogOut, Mail, Moon, Music, ShieldCheck, Sparkles, User, X, Zap,
} from "lucide-react";
import {
  AccountChip, AccordionFooter, AccordionText, Alert, AppRedirectChip, AppWindow, BackupCodes, BottomSheet,
  Button, ButtonGroup, ButtonGroupItem, ButtonLink, CheckList, CirButton, CirTabs, CodeInput, CornerGroup,
  CtaButton, DEFAULT_DASHBOARD_WIDGETS, DesktopViewport, DetailRow, Divider, Drawer, DrawerHeader,
  DrawerSectionTitle, FeatureList, FeatureRow, Field, FormFooter, FormHeader, GlassPanel, HealthBar,
  IconButton, Input, InvertedCornerFillet, List, ListEmpty, ListItem, ListRow, ListRowGroup, Logo, MainContent,
  Metric, ModularPanel, Notice, OverviewEmptyState, PanelHero, PasswordInput, PRESSABLE_WIDGETS, Price,
  ProfileHero, SearchBar, Sidebar, SidebarFooter, SidebarLogout, SidebarNav, SidebarNavItem, SidebarUser,
  Spinner, SplitWindow, Standby, StatusPill, Tag, TokenBox, View, ViewHeader, WallpaperPicker,
  WidgetContent, WidgetCustomizer, WidgetSquircle, WidgetTile, type DashboardWidgetConfig, type WidgetContext,
} from "../src";

const WALLPAPER = "linear-gradient(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.36)), url('../../assets/dolomiti-hero.jpg') center/cover no-repeat, #07090e";
const noop = () => {};

/* ───────────── Parti della pagina ───────────── */

// Evidenziazione minima: tag JSX, stringhe e commenti
function highlight(code: string) {
  return code.split(/("[^"\n]*"|'[^'\n]*'|\/\/[^\n]*|<\/?[A-Za-z][\w.]*)/g).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("//")) return <span key={i} className="c">{part}</span>;
    if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="s">{part}</span>;
    if (part.startsWith("<")) return <span key={i} className="t">{part}</span>;
    return part;
  });
}

function Code({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="doc-code">
      <button
        type="button"
        className="doc-copy"
        onClick={() => {
          navigator.clipboard?.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
      >
        {copied ? "Copiato" : "Copia"}
      </button>
      <pre>
        <code>{highlight(code)}</code>
      </pre>
    </div>
  );
}

type PropRow = [name: string, type: string, description: string];

function Props({ rows }: { rows: PropRow[] }) {
  return (
    <table className="doc-props">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Tipo</th>
          <th>Descrizione</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, type, description]) => (
          <tr key={name}>
            <td><code>{name}</code></td>
            <td><code>{type}</code></td>
            <td>{description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Nelle anteprime i link non portano da nessuna parte
const stopLinks = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest("a")) e.preventDefault();
};

interface DocItem {
  id: string;
  title: string;
  names: string[];
  description: ReactNode;
  preview?: ReactNode;
  stage?: "plain" | "start" | "wallpaper" | "full";
  code: string;
  props?: PropRow[];
  /** Componente sconsigliato: mostra l'etichetta e l'avviso */
  deprecated?: ReactNode;
}

function Item({ item }: { item: DocItem }) {
  const stageClass = item.stage === "start" ? "is-start" : item.stage === "wallpaper" ? "is-wallpaper" : item.stage === "full" ? "is-full" : "";
  return (
    <article className="doc-item" id={item.id}>
      <h3>
        {item.title}
        {item.names.map((n) => (
          <code key={n}>{n}</code>
        ))}
        {item.deprecated && <span className="doc-deprecated-badge">Deprecato</span>}
      </h3>
      <p>{item.description}</p>
      {item.deprecated && (
        <div className="doc-deprecated" role="note">
          <strong>Sconsigliato.</strong> {item.deprecated}
        </div>
      )}
      <div className="doc-card">
        {item.preview && (
          <div className={`doc-stage ${stageClass}`} onClickCapture={stopLinks}>
            {item.preview}
          </div>
        )}
        <Code code={item.code} />
      </div>
      {item.props && <Props rows={item.props} />}
    </article>
  );
}

/* ───────────── Anteprime con stato ───────────── */

function LoginDemo() {
  return (
    <SplitWindow
      wallpaper={WALLPAPER}
      left={
        <>
          <div>
            <Logo href="#" style={{ fontSize: "1.85rem", marginBottom: "2rem" }} />
            <PanelHero title="Bentornato nel tuo workspace." description="Un'unica identità per musica, chat cifrata, intelligenza artificiale e mobilità." />
          </div>
          <FeatureList>
            <FeatureRow icon={KeyRound} title="Passkey FIDO2 Native" description="Autenticazione biometrica Face ID o Touch ID" />
            <FeatureRow icon={Zap} title="Single Sign-On Ecosistema" description="Sessione crittografata attiva su tutti i servizi" />
          </FeatureList>
        </>
      }
      right={
        <>
          <FormHeader title="Accedi al tuo Account" description="Inserisci le tue credenziali per autenticarti" />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", marginBottom: "1.5rem" }}>
            <Field label="Email o Username"><Input icon={Mail} placeholder="nome@ticly.it" /></Field>
            <Field label="Password" trailing={<a href="#" style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.78rem" }}>Dimenticata?</a>}>
              <PasswordInput placeholder="••••••••••••" />
            </Field>
          </div>
          <Button size="lg" block><span>Accedi con Password</span><ArrowRight size={16} /></Button>
          <Divider />
          <Button variant="secondary" block style={{ padding: "0.8rem", gap: "9px", fontSize: "0.88rem" }}><KeyRound size={17} /><span>Accedi con Passkey Biometrica</span></Button>
          <FormFooter text="Non hai ancora un account?" linkLabel="Registrati gratis" href="#" />
        </>
      }
    />
  );
}

const NAV = [
  { id: "panoramica", label: "Panoramica", icon: LayoutDashboard },
  { id: "vantaggi", label: "Vantaggi", icon: Sparkles },
  { id: "sicurezza", label: "Sicurezza", icon: ShieldCheck },
  { id: "piani", label: "Piani", icon: CreditCard },
  { id: "profilo", label: "Profilo", icon: User },
];

function AppDemo() {
  const [tab, setTab] = useState("sicurezza");
  const [drawer, setDrawer] = useState(false);
  return (
    <DesktopViewport wallpaper={WALLPAPER}>
      <AppWindow initial={false} editMode={drawer}>
        <Sidebar>
          <Logo href="#" style={{ fontSize: "1.8rem", paddingLeft: "0.5rem", marginBottom: "0.5rem" }} />
          <TokenBox value={1500} max={5000} />
          <SidebarNav>
            {NAV.map(({ id, label, icon: Icon }) => (
              <SidebarNavItem key={id} icon={<Icon size={18} />} active={tab === id} onClick={() => setTab(id)}>
                {label}
              </SidebarNavItem>
            ))}
          </SidebarNav>
          <SidebarFooter>
            <SidebarUser name="Mario Rossi" email="mario.rossi@ticly.it" />
            <SidebarLogout />
          </SidebarFooter>
        </Sidebar>
        <MainContent drawerOpen={drawer}>
          <View>
            <ViewHeader title="Sicurezza & Autenticazione" subtitle="Passkey, verifica in due passaggi e recupero" actions={<Button size="sm" onClick={() => setDrawer(true)}>Configura 2FA</Button>}>
            </ViewHeader>
            <List>
              <ListItem icon={<Key size={20} />} title="Passkeys Biometriche (FIDO2)" category="Hardware Key" description="1 chiave hardware registrata" trailing={<StatusPill active>1 Attive</StatusPill>} defaultOpen>
                <AccordionText>Accedi all'istante con impronta, volto o chiave di sicurezza USB.</AccordionText>
                <ListRowGroup>
                  <ListRow icon={Laptop} title="Passkey Dispositivo" meta="#a1b2c3d4" subtitle="Registrata il 10 gennaio 2026" action={<Button variant="danger" style={{ padding: "0.35rem 0.85rem", fontSize: "0.76rem" }}>Rimuovi</Button>} />
                </ListRowGroup>
              </ListItem>
              <ListItem icon={<ShieldCheck size={20} />} title="Verifica in due passaggi" category="TOTP" description="Non configurata" trailing={<StatusPill>Inattiva</StatusPill>}>
                <ListEmpty>Nessuna app Authenticator collegata.</ListEmpty>
              </ListItem>
            </List>
          </View>
        </MainContent>
        <Drawer open={drawer} variant="split">
          <DrawerHeader icon={ShieldCheck} title="Configura 2FA TOTP" subtitle="Autenticazione a due fattori" onClose={() => setDrawer(false)} />
          <div>
            <DrawerSectionTitle title="Codici di Sicurezza Monouso" meta="6 codici" />
            <BackupCodes codes={["A1B2-C3D4", "E5F6-G7H8", "J9K0-L1M2", "N3P4-Q5R6", "S7T8-U9V0", "W1X2-Y3Z4"]} />
          </div>
        </Drawer>
      </AppWindow>
    </DesktopViewport>
  );
}

function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Apri il pannello dal basso</Button>
      <BottomSheet open={open} onClose={() => setOpen(false)} aria-label="Esempio">
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <DrawerHeader title="Personalizza" subtitle="Bottom sheet su mobile" onClose={() => setOpen(false)} />
          <AccordionText>Tocca fuori dal pannello o la X per chiuderlo.</AccordionText>
        </div>
      </BottomSheet>
    </>
  );
}

function StandbyDemo() {
  const [on, setOn] = useState(true);
  return (
    <DesktopViewport wallpaper={WALLPAPER} style={{ height: 460 }}>
      {on ? (
        <Standby label="Dolomiti (Tramonto)" onExit={() => setOn(false)} onSettings={() => setOn(false)} />
      ) : (
        <Button variant="secondary" onClick={() => setOn(true)}>Torna in standby</Button>
      )}
    </DesktopViewport>
  );
}

function CodeDemo() {
  const [code, setCode] = useState("");
  return (
    <div style={{ width: 300 }}>
      <Field label="Codice 2FA">
        <CodeInput value={code} onValueChange={setCode} />
      </Field>
    </div>
  );
}

function SearchDemo() {
  const [q, setQ] = useState("sic");
  const results = [
    { id: "s", icon: "🔐", title: "Sicurezza", description: "Passkey, 2FA e recupero", action: noop },
    { id: "p", icon: "💳", title: "Piani", description: "Abbonamento e fatture", action: noop },
  ].filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <OverviewEmptyState style={{ minHeight: 0, paddingBottom: 120 }}>
      <ProfileHero name="Mario Rossi" email="mario.rossi@ticly.it" />
      <SearchBar value={q} onValueChange={setQ} results={results} />
    </OverviewEmptyState>
  );
}

function WallpaperDemo() {
  const [wp, setWp] = useState("dolomiti");
  return (
    <div style={{ width: "100%", maxWidth: 760 }}>
      <WallpaperPicker value={wp} onValueChange={setWp} />
      <p className="doc-note" style={{ marginTop: 12 }}>Selezionato: <code>{wp}</code>. Nel tuo progetto passa lo sfondo a <code>DesktopViewport</code> con <code>getWallpaperStyle(id)</code>.</p>
    </div>
  );
}

const widgetCtx: WidgetContext = {
  user: { id: "usr_8f2a", name: "Mario Rossi", email: "mario.rossi@ticly.it", role: "USER", subscription: "PRO", twoFactorEnabled: true, passkeys: [{}], createdAt: "2026-01-10" },
  now: new Date(),
  securityScore: 80,
  tokens: { balance: 1500, monthly: 5000 },
  apps: [],
  searchQuery: "",
  onSearchQueryChange: noop,
  searchResults: [],
  searchSuggestions: [],
  notes: "Ricordati di rinnovare la passkey",
  onNotesChange: noop,
  onNavigate: noop,
  onManageBilling: noop,
  onExportData: noop,
};

const DEMO_WIDGETS: DashboardWidgetConfig[] = DEFAULT_DASHBOARD_WIDGETS.filter((w) => ["identity", "security", "tokens", "scratchpad"].includes(w.id)).map((w, i) => ({ ...w, enabled: true, order: i + 1, size: w.id === "identity" ? "2x" : "1x" }));

function WidgetsDemo() {
  return (
    <div className="dw-grid-container">
      <div className="dw-grid">
        {DEMO_WIDGETS.map((w) => (
          <WidgetTile key={w.id} widget={w} isEditMode={false} isPressable={PRESSABLE_WIDGETS.has(w.id)} onDragStart={noop} onDrag={noop} onDragEnd={noop} onRemove={noop} onMove={noop} onSizeChange={noop} onResizeStart={noop} onResizePreview={noop} onResizeEnd={noop}>
            <WidgetContent widget={w} ctx={widgetCtx} />
          </WidgetTile>
        ))}
      </div>
    </div>
  );
}

function CustomizerDemo() {
  const [view, setView] = useState<"layout" | "gallery">("layout");
  return (
    <div style={{ width: 384, maxWidth: "100%" }}>
      <WidgetCustomizer widgets={DEFAULT_DASHBOARD_WIDGETS} view={view} onViewChange={setView} renderPreview={(w) => <WidgetContent widget={w} ctx={widgetCtx} />} onApplyPreset={noop} onAdd={noop} onReveal={noop} onRemove={noop} onMove={noop} onSizeChange={noop} onReorderStart={noop} onReorder={noop} onReorderEnd={noop} onReset={noop} onClose={noop} onDone={noop} />
    </div>
  );
}

/* ───────────── Contenuti ───────────── */

interface DocSection {
  id: string;
  title: string;
  intro: ReactNode;
  items: DocItem[];
}

const SECTIONS: DocSection[] = [
  {
    id: "inizia",
    title: "Inizia",
    intro: "arc UI sono i componenti custom di login.ticly.it, raccolti in una libreria React. Servono un progetto Next.js 15 o successivo e React 19. Non serve Tailwind.",
    items: [
      {
        id: "installazione",
        title: "Installazione",
        names: ["@arcbaseorg/ui"],
        description: "Installa il pacchetto da npm. Le dipendenze (Framer Motion e Lucide) arrivano insieme.",
        code: "npm install @arcbaseorg/ui",
      },
      {
        id: "configurazione",
        title: "Configurazione",
        names: ["styles.css"],
        description: (
          <>
            Importa gli stili una volta, nel layout principale. Gli sfondi delle Dolomiti puntano a <code>/dolomiti-default.jpg</code> e alle altre immagini di login: copiale nella cartella <code>public/</code> del progetto, o passa a <code>DesktopViewport</code> e <code>SplitWindow</code> uno sfondo tuo con la prop <code>wallpaper</code>.
          </>
        ),
        code: `// app/layout.tsx
import "@arcbaseorg/ui/styles.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}`,
      },
      {
        id: "primo-esempio",
        title: "Primo esempio",
        names: ["\"use client\""],
        description: "I componenti hanno stato e animazioni, quindi vanno usati in componenti client. Il pacchetto è già marcato \"use client\".",
        preview: (
          <div style={{ display: "flex", gap: 12 }}>
            <Button>Primario</Button>
            <Button variant="secondary">Secondario</Button>
          </div>
        ),
        code: `"use client"

import { Button } from "@arcbaseorg/ui"

export function Azioni() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Button>Primario</Button>
      <Button variant="secondary">Secondario</Button>
    </div>
  )
}`,
      },
    ],
  },
  {
    id: "finestre",
    title: "Finestre e layout",
    intro: "Le finestre in vetro sopra il wallpaper: la split window della pagina di accesso e la finestra app della dashboard, con sidebar, contenuti e pannelli laterali.",
    items: [
      {
        id: "split-window",
        title: "Split window",
        names: ["SplitWindow"],
        description: "La finestra divisa in due della pagina di accesso: presentazione a sinistra, modulo a destra. Sotto gli 860px resta solo il pannello destro.",
        stage: "full",
        preview: <LoginDemo />,
        code: `<SplitWindow
  left={
    <>
      <div>
        <Logo style={{ fontSize: "1.85rem", marginBottom: "2rem" }} />
        <PanelHero title="Bentornato nel tuo workspace." description="Un'unica identità per tutti i servizi." />
      </div>
      <FeatureList>
        <FeatureRow icon={KeyRound} title="Passkey FIDO2 Native" description="Face ID o Touch ID" />
      </FeatureList>
    </>
  }
  right={
    <form>
      <FormHeader title="Accedi al tuo Account" description="Inserisci le tue credenziali" />
      <Field label="Email o Username"><Input icon={Mail} placeholder="nome@ticly.it" /></Field>
      <Field label="Password"><PasswordInput placeholder="••••••••••••" /></Field>
      <Button type="submit" size="lg" block>Accedi con Password</Button>
      <Divider />
      <Button variant="secondary" block>Accedi con Passkey Biometrica</Button>
      <FormFooter text="Non hai ancora un account?" linkLabel="Registrati gratis" href="/register" />
    </form>
  }
/>`,
        props: [
          ["left", "ReactNode", "Contenuto del pannello sinistro."],
          ["right", "ReactNode", "Contenuto del pannello destro (il modulo)."],
          ["wallpaper", "string", "Sfondo CSS. Default: Dolomiti al tramonto."],
          ["contentWidth", "number | string", "Larghezza massima del contenuto a destra. Default 390."],
        ],
      },
      {
        id: "finestra-app",
        title: "Finestra app",
        names: ["DesktopViewport", "AppWindow", "Sidebar", "MainContent", "Drawer"],
        description: "La finestra della dashboard: sidebar con la navigazione a corner game, area dei contenuti e un pannello laterale che si apre accanto. Prova le voci della sidebar e il pulsante Configura 2FA.",
        stage: "full",
        preview: <AppDemo />,
        code: `<DesktopViewport>
  <AppWindow editMode={drawerOpen}>
    <Sidebar>
      <Logo />
      <TokenBox value={1500} max={5000} />
      <SidebarNav>
        <SidebarNavItem icon={<ShieldCheck size={18} />} active>Sicurezza</SidebarNavItem>
        <SidebarNavItem icon={<CreditCard size={18} />}>Piani</SidebarNavItem>
      </SidebarNav>
      <SidebarFooter>
        <SidebarUser name="Mario Rossi" email="mario.rossi@ticly.it" />
        <SidebarLogout onClick={esci} />
      </SidebarFooter>
    </Sidebar>
    <MainContent drawerOpen={drawerOpen}>
      <View>
        <ViewHeader title="Sicurezza & Autenticazione" subtitle="Passkey, 2FA e recupero" />
        {/* contenuto */}
      </View>
    </MainContent>
    <Drawer open={drawerOpen} variant="split">
      <DrawerHeader icon={ShieldCheck} title="Configura 2FA TOTP" onClose={chiudi} />
    </Drawer>
  </AppWindow>
</DesktopViewport>`,
        props: [
          ["DesktopViewport.wallpaper", "string", "Sfondo a tutto schermo."],
          ["AppWindow.editMode", "boolean", "Allarga la finestra quando è aperto un pannello laterale."],
          ["Sidebar.open / onClose", "boolean / () => void", "Su mobile apre la sidebar sopra i contenuti, con l'overlay."],
          ["SidebarNavItem.active", "boolean", "Voce selezionata: diventa una pillola e le vicine si modellano attorno."],
          ["MainContent.drawerOpen", "boolean", "Stringe gli angoli quando c'è un pannello accanto."],
          ["Drawer.variant", "\"panel\" | \"split\"", "Pannello da 384px (personalizzazione) o da 420px (2FA)."],
        ],
      },
      {
        id: "viste",
        title: "Viste",
        names: ["View", "ViewHeader"],
        description: "Contenitore e intestazione di una sezione. Con actions il titolo va a sinistra e le azioni a destra; i children finiscono sotto il sottotitolo.",
        stage: "start",
        preview: (
          <View animated={false} style={{ padding: 0 }}>
            <ViewHeader title="I tuoi Vantaggi" subtitle="Servizi inclusi nel tuo account ticly PRO" actions={<Button variant="secondary" size="sm"><span>Vedi Piani</span><ExternalLink size={13} /></Button>} />
            <ViewHeader title="Sicurezza & Autenticazione" subtitle="Proteggi il tuo account">
              <HealthBar value={80} />
            </ViewHeader>
          </View>
        ),
        code: `<View>
  <ViewHeader
    title="I tuoi Vantaggi"
    subtitle="Servizi inclusi nel tuo account ticly PRO"
    actions={<Button variant="secondary" size="sm">Vedi Piani</Button>}
  />
  <ViewHeader title="Sicurezza & Autenticazione" subtitle="Proteggi il tuo account">
    <HealthBar value={80} />
  </ViewHeader>
</View>`,
        props: [
          ["View.animated", "boolean", "Dissolvenza d'ingresso. Default true."],
          ["ViewHeader.title / subtitle", "ReactNode", "Titolo grande e sottotitolo grigio."],
          ["ViewHeader.actions", "ReactNode", "Azioni a destra del titolo."],
        ],
      },
      {
        id: "pannelli",
        title: "Pannelli",
        names: ["GlassPanel", "ModularPanel", "CornerGroup"],
        description: "Il pannello in vetro di piani e checkout, e i pannelli raggruppati con angoli esterni grandi e interni piccoli (in colonna o in riga).",
        stage: "start",
        preview: (
          <div style={{ display: "grid", gap: 16 }}>
            <GlassPanel style={{ padding: "1.5rem" }}>
              <strong>GlassPanel</strong>
              <p style={{ color: "#999", marginTop: 6 }}>Vetro scuro con bordo, come le card dei piani.</p>
            </GlassPanel>
            <CornerGroup direction="row">
              <ModularPanel><Metric label="Token AI" value="1.500" sub="disponibili su 5.000" /></ModularPanel>
              <ModularPanel><DetailRow label="Piano" value="Pro" /><DetailRow label="Membro da" value="Gennaio 2026" /></ModularPanel>
            </CornerGroup>
          </div>
        ),
        code: `<GlassPanel>Contenuto</GlassPanel>

<CornerGroup direction="row">
  <ModularPanel><Metric label="Token AI" value="1.500" sub="disponibili su 5.000" /></ModularPanel>
  <ModularPanel><DetailRow label="Piano" value="Pro" /></ModularPanel>
</CornerGroup>`,
        props: [
          ["GlassPanel.animated", "boolean", "Dissolvenza d'ingresso."],
          ["CornerGroup.direction", "\"column\" | \"row\"", "Pannelli impilati o affiancati (in colonna sotto i 900px)."],
        ],
      },
      {
        id: "barra-mobile",
        title: "Barra mobile",
        names: ["MobileHeaderBar"],
        description: "La barra in alto della dashboard su telefono: menu, titolo e avatar. È trasparente in cima e diventa sfocata quando si scorre. Si vede solo sotto gli 860px, per questo qui c'è solo il codice.",
        code: `<MainContent onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 8)}>
  <MobileHeaderBar
    title="Sicurezza"
    scrolled={scrolled}
    onMenuClick={() => setMenuOpen(true)}
    avatarFallback={user.name}
  />
</MainContent>`,
        props: [
          ["scrolled", "boolean", "Mostra il materiale sfocato e il titolo."],
          ["onMenuClick / onAvatarClick", "() => void", "Pulsanti a sinistra e a destra."],
          ["avatarSrc / avatarFallback", "string", "Immagine, o nome da cui prendere l'iniziale."],
        ],
      },
    ],
  },
  {
    id: "controlli",
    title: "Controlli",
    intro: "Bottoni, gruppi di bottoni connessi, campi e selettori.",
    items: [
      {
        id: "bottoni",
        title: "Bottoni",
        names: ["Button", "ButtonLink"],
        description: "I bottoni a pillola della dashboard e dell'accesso. Tre varianti e tre misure; block li allarga a tutta la riga. ButtonLink è lo stesso bottone come link.",
        preview: (
          <>
            <Button>Primario</Button>
            <Button variant="secondary">Secondario</Button>
            <Button variant="danger">Elimina</Button>
            <Button size="sm">Piccolo</Button>
            <ButtonLink href="#" size="sm"><span>Link</span><ExternalLink size={13} /></ButtonLink>
            <Button disabled>Disabilitato</Button>
          </>
        ),
        code: `<Button>Primario</Button>
<Button variant="secondary">Secondario</Button>
<Button variant="danger">Elimina</Button>
<Button size="sm">Piccolo</Button>
<ButtonLink href="https://music.ticly.it" size="sm">Link</ButtonLink>
<Button size="lg" block>Accedi con Password</Button>`,
        props: [
          ["variant", "\"primary\" | \"secondary\" | \"danger\"", "Bianco, vetro o rosso. Default primary (ButtonLink: secondary)."],
          ["size", "\"sm\" | \"md\" | \"lg\"", "Piccolo per liste e intestazioni, grande per i moduli di accesso."],
          ["block", "boolean", "Larghezza piena."],
        ],
      },
      {
        id: "bottoni-connessi",
        title: "Bottoni connessi",
        names: ["ButtonGroup", "ButtonGroupItem"],
        description: "Bottoni uniti con il corner game: angoli esterni grandi e interni piccoli; il selezionato diventa una pillola e i vicini si modellano attorno. Verticali come la sidebar, o orizzontali. Senza value sono semplici azioni.",
        stage: "start",
        preview: (
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ width: 220 }}>
              <ButtonGroup defaultValue="sicurezza" aria-label="Sezioni">
                <ButtonGroupItem value="account" icon={<User size={18} />}>Account</ButtonGroupItem>
                <ButtonGroupItem value="sicurezza" icon={<ShieldCheck size={18} />}>Sicurezza</ButtonGroupItem>
                <ButtonGroupItem value="notifiche" icon={<Bell size={18} />}>Notifiche</ButtonGroupItem>
                <ButtonGroupItem value="piani" icon={<CreditCard size={18} />}>Piani</ButtonGroupItem>
              </ButtonGroup>
            </div>
            <div style={{ width: 200 }}>
              <ButtonGroup aria-label="Azioni">
                <ButtonGroupItem icon={<Download size={18} />}>Esporta dati</ButtonGroupItem>
                <ButtonGroupItem icon={<LogOut size={18} />}>Esci</ButtonGroupItem>
              </ButtonGroup>
            </div>
            <ButtonGroup orientation="horizontal" defaultValue="mese" aria-label="Periodo">
              <ButtonGroupItem value="giorno">Giorno</ButtonGroupItem>
              <ButtonGroupItem value="settimana">Settimana</ButtonGroupItem>
              <ButtonGroupItem value="mese">Mese</ButtonGroupItem>
              <ButtonGroupItem value="anno">Anno</ButtonGroupItem>
            </ButtonGroup>
          </div>
        ),
        code: `// Selettore verticale, come la sidebar
<ButtonGroup defaultValue="sicurezza">
  <ButtonGroupItem value="account" icon={<User size={18} />}>Account</ButtonGroupItem>
  <ButtonGroupItem value="sicurezza" icon={<ShieldCheck size={18} />}>Sicurezza</ButtonGroupItem>
  <ButtonGroupItem value="piani" icon={<CreditCard size={18} />}>Piani</ButtonGroupItem>
</ButtonGroup>

// Azioni connesse, senza selezione
<ButtonGroup>
  <ButtonGroupItem icon={<Download size={18} />} onClick={esporta}>Esporta dati</ButtonGroupItem>
  <ButtonGroupItem icon={<LogOut size={18} />} onClick={esci}>Esci</ButtonGroupItem>
</ButtonGroup>

// Orizzontale, controllato
<ButtonGroup orientation="horizontal" value={periodo} onValueChange={setPeriodo}>
  <ButtonGroupItem value="mese">Mese</ButtonGroupItem>
  <ButtonGroupItem value="anno">Anno</ButtonGroupItem>
</ButtonGroup>`,
        props: [
          ["orientation", "\"vertical\" | \"horizontal\"", "Default vertical."],
          ["value / defaultValue", "string", "Bottone selezionato, controllato o iniziale."],
          ["onValueChange", "(value: string) => void", "Chiamata quando si sceglie un bottone con value."],
          ["ButtonGroupItem.value", "string", "Senza value il bottone è solo un'azione."],
          ["ButtonGroupItem.icon / active", "ReactNode / boolean", "Icona a sinistra; active forza la pillola."],
        ],
      },
      {
        id: "altri-bottoni",
        title: "Altri bottoni",
        names: ["CtaButton", "CirButton", "IconButton"],
        description: "Il bottone grande delle pagine piani e checkout (occupa tutta la larghezza), la pillola bianca con freccia e il pulsante quadrato con icona dei pannelli.",
        preview: (
          <>
            <div style={{ display: "flex", gap: 12, width: 420 }}>
              <CtaButton>CTA primario</CtaButton>
              <CtaButton variant="secondary">CTA secondario</CtaButton>
            </div>
            <CirButton href="#">Scopri</CirButton>
            <IconButton aria-label="Chiudi"><X size={14} /></IconButton>
            <IconButton round aria-label="Chiudi"><X size={14} /></IconButton>
          </>
        ),
        code: `<CtaButton>Abbonati</CtaButton>
<CtaLink href="/pricing" variant="secondary">Annulla</CtaLink>
<CirButton href="/ui/">Scopri</CirButton>
<IconButton round aria-label="Chiudi"><X size={14} /></IconButton>`,
        props: [
          ["CtaButton.variant", "\"primary\" | \"secondary\"", "Viola pieno o vetro."],
          ["CirButton.arrow", "boolean", "Freccia a destra. Default true."],
          ["IconButton.round", "boolean", "Tondo da 28px, come la chiusura dei drawer."],
        ],
      },
      {
        id: "campi",
        title: "Campi",
        names: ["Field", "Input", "PasswordInput"],
        description: "Etichetta maiuscola con elemento a destra opzionale, campo con icona e password con il pulsante per mostrarla.",
        stage: "start",
        preview: (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", maxWidth: 390 }}>
            <Field label="Email o Username"><Input icon={Mail} placeholder="nome@ticly.it" /></Field>
            <Field label="Password" trailing={<a href="#" style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.78rem" }}>Dimenticata?</a>}>
              <PasswordInput placeholder="••••••••••••" defaultValue="segreta" />
            </Field>
            <Field label="Nome"><Input placeholder="Mario Rossi" /></Field>
          </div>
        ),
        code: `<Field label="Email o Username">
  <Input icon={Mail} placeholder="nome@ticly.it" />
</Field>

<Field label="Password" trailing={<Link href="/recover">Dimenticata?</Link>}>
  <PasswordInput placeholder="••••••••••••" />
</Field>`,
        props: [
          ["Field.label / trailing", "ReactNode", "Etichetta e, a destra, un link o un'azione."],
          ["Input.icon", "LucideIcon", "Icona a sinistra, es. Mail."],
          ["PasswordInput.icon", "LucideIcon | null", "Default Lock; null per nessuna icona."],
        ],
      },
      {
        id: "codice-2fa",
        title: "Codice 2FA",
        names: ["CodeInput"],
        description: "Il codice grande e centrato della verifica in due passaggi. onValueChange riceve solo le cifre; con backup accetta i codici XXXX-XXXX in maiuscolo.",
        preview: <CodeDemo />,
        code: `const [code, setCode] = useState("")

<CodeInput value={code} onValueChange={setCode} />
<CodeInput backup value={backupCode} onValueChange={setBackupCode} />`,
        props: [
          ["backup", "boolean", "Codice di backup invece delle 6 cifre."],
          ["onValueChange", "(value: string) => void", "Valore già ripulito."],
        ],
      },
      {
        id: "cir-tabs",
        title: "Tabs a pillola",
        names: ["CirTabs"],
        description: "Il selettore a pillola con la scheda attiva bianca, in riga o in colonna.",
        deprecated: (
          <>
            Continua a funzionare, ma per i nuovi progetti usa i <a href="#bottoni-connessi">bottoni connessi</a> (<code>ButtonGroup</code>), orizzontali o verticali.
          </>
        ),
        stage: "start",
        preview: (
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
            <CirTabs items={[{ value: "self", label: "Self-hosted" }, { value: "cloud", label: "Cloud" }, { value: "ibrido", label: "Ibrido" }]} />
            <div style={{ width: 240 }}>
              <CirTabs vertical items={[{ value: "account", label: "Account" }, { value: "sicurezza", label: "Sicurezza" }, { value: "piani", label: "Piani" }]} />
            </div>
          </div>
        ),
        code: `<CirTabs
  items={[
    { value: "self", label: "Self-hosted" },
    { value: "cloud", label: "Cloud" },
  ]}
  value={modo}
  onValueChange={setModo}
/>

<CirTabs vertical items={voci} />`,
        props: [
          ["items", "{ value, label, icon? }[]", "Le schede."],
          ["value / defaultValue / onValueChange", "string", "Scheda selezionata."],
          ["vertical", "boolean", "In colonna."],
        ],
      },
    ],
  },
  {
    id: "liste",
    title: "Liste",
    intro: "Elenchi di righe connesse con il corner game. Ogni riga può essere statica, cliccabile o a fisarmonica: basta darle un contenuto. I clic su bottoni e link dentro la riga non la aprono.",
    items: [
      {
        id: "lista",
        title: "Lista",
        names: ["List", "ListItem"],
        description: "La variante stack, quella delle sezioni Vantaggi, Sicurezza e Profilo. Qui una riga statica, una cliccabile e una a fisarmonica.",
        stage: "start",
        preview: (
          <List>
            <ListItem icon={<Globe size={20} />} title="Lingua" description="Lingua dell'interfaccia" trailing="Italiano" />
            <ListItem icon={<Moon size={20} />} title="Aspetto" description="Scuro, sfondo Dolomiti" onClick={noop} />
            <ListItem icon={<Key size={20} />} title="Passkeys" category="Hardware Key" description="1 chiave registrata" trailing={<StatusPill active>1 Attive</StatusPill>}>
              <AccordionText>Accedi all'istante con impronta, volto o chiave di sicurezza USB.</AccordionText>
              <AccordionFooter><Button size="sm">Aggiungi passkey</Button></AccordionFooter>
            </ListItem>
            <ListItem index="02" icon={<Music size={18} />} title="ticly music" category="Streaming Audio" description="Ascolto Hi-Fi FLAC e download offline" trailing="Hi-Fi FLAC">
              <AccordionText>Qualità studio fino a 24-bit / 192kHz.</AccordionText>
              <CheckList items={["Download offline", "Skip illimitati", "Nessuna pubblicità"]} />
              <AccordionFooter status="Hi-Fi FLAC"><ButtonLink href="#" size="sm"><span>Ascolta</span><ExternalLink size={13} /></ButtonLink></AccordionFooter>
            </ListItem>
          </List>
        ),
        code: `<List>
  <ListItem icon={<Globe size={20} />} title="Lingua" trailing="Italiano" />
  <ListItem icon={<Moon size={20} />} title="Aspetto" description="Scuro" onClick={apriAspetto} />
  <ListItem icon={<Key size={20} />} title="Passkeys" category="Hardware Key"
    description="1 chiave registrata" trailing={<StatusPill active>1 Attive</StatusPill>}>
    <AccordionText>Accedi con impronta, volto o chiave USB.</AccordionText>
    <AccordionFooter><Button size="sm">Aggiungi passkey</Button></AccordionFooter>
  </ListItem>
  <ListItem index="02" title="ticly music" trailing="Hi-Fi FLAC">
    <CheckList items={["Download offline", "Skip illimitati"]} />
    <AccordionFooter status="Hi-Fi FLAC"><ButtonLink href="/music" size="sm">Ascolta</ButtonLink></AccordionFooter>
  </ListItem>
</List>`,
        props: [
          ["List.variant", "\"stack\" | \"compact\"", "Righe grandi (default) o piccole."],
          ["title / description / category", "ReactNode", "Titolo, riga sotto (da chiusa) ed etichetta maiuscola."],
          ["icon / index / trailing", "ReactNode", "Icona, numero a sinistra, testo o elemento a destra."],
          ["onClick / href", "() => void / string", "Riga cliccabile o link."],
          ["children", "ReactNode", "Contenuto che si apre: la riga diventa una fisarmonica."],
          ["open / defaultOpen / onOpenChange", "boolean", "Stato della fisarmonica, controllato o iniziale."],
        ],
      },
      {
        id: "lista-piani",
        title: "Varianti per piano",
        names: ["tone", "highlighted", "Price", "Tag"],
        description: "Come nella sezione Piani: bordo viola, oro o bianco per piano, il piano attivo evidenziato, il prezzo in evidenza e le piccole etichette accanto al nome.",
        stage: "start",
        preview: (
          <List>
            <ListItem highlighted leading={<Price value="€0" />} title="Free" description="Modelli gratuiti • 1 Space" badges={<Tag tone="success">Piano Attivo</Tag>} trailing="In uso">
              <CheckList items={["5 modelli gratuiti", "1 Space"]} />
            </ListItem>
            <ListItem tone="pro" leading={<Price value="€9" />} title="Pro" description="2.000.000 token/mese" badges={<Tag>Consigliato</Tag>} trailing={<Button size="sm">Scegli</Button>}>
              <CheckList items={["Claude Haiku 4.5, Kimi K2.6", "5 Spaces"]} />
            </ListItem>
            <ListItem tone="mega" leading={<Price value="€29" />} title="Mega" description="10.000.000 token/mese" badges={<Tag tone="gold">Potenza 5x</Tag>} trailing={<Button variant="secondary" size="sm">Scegli</Button>}>
              <CheckList items={["Claude Opus 5, GPT-5.5", "20 Spaces"]} />
            </ListItem>
            <ListItem tone="ultra" leading={<Price value="€99" />} title="Ultra" description="Crediti estesi e Spaces illimitati" badges={<Tag tone="white">Top di Gamma</Tag>} trailing={<Button variant="secondary" size="sm">Scegli</Button>}>
              <CheckList items={["Claude Fable 5.1, GPT-6 Astra", "Spaces illimitati"]} />
            </ListItem>
          </List>
        ),
        code: `<List>
  <ListItem highlighted leading={<Price value="€0" />} title="Free"
    badges={<Tag tone="success">Piano Attivo</Tag>} trailing="In uso" />
  <ListItem tone="pro" leading={<Price value="€9" />} title="Pro"
    badges={<Tag>Consigliato</Tag>} trailing={<Button size="sm">Scegli</Button>}>
    <CheckList items={["5 Spaces", "Modelli avanzati"]} />
  </ListItem>
  <ListItem tone="mega" leading={<Price value="€29" />} title="Mega"
    badges={<Tag tone="gold">Potenza 5x</Tag>} />
  <ListItem tone="ultra" leading={<Price value="€99" />} title="Ultra"
    badges={<Tag tone="white">Top di Gamma</Tag>} />
</List>`,
        props: [
          ["tone", "\"pro\" | \"mega\" | \"ultra\"", "Colore del bordo (solo variante stack)."],
          ["highlighted", "boolean", "Evidenzia la riga, come il piano attivo."],
          ["leading", "ReactNode", "Blocco prima del titolo, es. <Price />."],
          ["badges", "ReactNode", "Etichette accanto al titolo, es. <Tag />."],
          ["Price.value / period", "ReactNode", "Prezzo e periodo (default \"/mese\")."],
          ["Tag.tone", "\"neutral\" | \"gold\" | \"white\" | \"success\"", "Colore dell'etichetta."],
        ],
      },
      {
        id: "lista-compatta",
        title: "Lista compatta",
        names: ["List variant=\"compact\""],
        description: "Righe piccole, come i risultati della ricerca. Anche qui una riga può essere un link, un'azione o una fisarmonica.",
        stage: "start",
        preview: (
          <div style={{ maxWidth: 420 }}>
            <List variant="compact">
              <ListItem icon="🔐" title="Sicurezza" description="Passkey e 2FA" href="#" />
              <ListItem icon="💳" title="Abbonamento" description="Gestisci il piano" onClick={noop} />
              <ListItem icon="🎧" title="ticly music" description="Hi-Fi FLAC">
                <AccordionText style={{ marginBottom: 0 }}>Streaming in alta fedeltà e download offline.</AccordionText>
              </ListItem>
            </List>
          </div>
        ),
        code: `<List variant="compact">
  <ListItem icon="🔐" title="Sicurezza" description="Passkey e 2FA" href="/sicurezza" />
  <ListItem icon="💳" title="Abbonamento" description="Gestisci il piano" onClick={apri} />
  <ListItem icon="🎧" title="ticly music" description="Hi-Fi FLAC">
    <AccordionText>Streaming in alta fedeltà.</AccordionText>
  </ListItem>
</List>`,
      },
      {
        id: "righe",
        title: "Righe di dispositivi",
        names: ["ListRowGroup", "ListRow", "ListEmpty"],
        description: "Le righe separate dentro una sezione aperta, come l'elenco delle Passkey, e il riquadro tratteggiato per un elenco vuoto.",
        stage: "start",
        preview: (
          <div style={{ maxWidth: 560 }}>
            <ListRowGroup>
              <ListRow icon={Laptop} title="Passkey Dispositivo" meta="#a1b2c3d4" subtitle="Registrata il 10 gennaio 2026" action={<Button variant="danger" style={{ padding: "0.35rem 0.85rem", fontSize: "0.76rem" }}>Rimuovi</Button>} />
              <ListRow icon={Laptop} title="Passkey Dispositivo" meta="#e5f6a7b8" subtitle="Registrata il 2 marzo 2026" />
            </ListRowGroup>
            <ListEmpty>Nessuna Passkey biometrica attiva.</ListEmpty>
          </div>
        ),
        code: `<ListRowGroup>
  <ListRow
    icon={Laptop}
    title="Passkey Dispositivo"
    meta="#a1b2c3d4"
    subtitle="Registrata il 10 gennaio 2026"
    action={<Button variant="danger" size="sm">Rimuovi</Button>}
  />
</ListRowGroup>

<ListEmpty>Nessuna Passkey biometrica attiva.</ListEmpty>`,
      },
      {
        id: "dettagli",
        title: "Etichetta e valore",
        names: ["DetailRow", "Metric"],
        description: "Righe etichetta/valore con separatore e il numero grande con etichetta.",
        stage: "start",
        preview: (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 640 }}>
            <Metric label="Token AI" value="1.500" sub="disponibili su 5.000" />
            <div>
              <DetailRow label="Piano" value="Pro" />
              <DetailRow label="Membro da" value="Gennaio 2026" />
              <DetailRow label="ID account" value="usr_8f2a" />
            </div>
          </div>
        ),
        code: `<Metric label="Token AI" value="1.500" sub="disponibili su 5.000" />

<DetailRow label="Piano" value="Pro" />
<DetailRow label="Membro da" value="Gennaio 2026" />`,
      },
    ],
  },
  {
    id: "accesso",
    title: "Accesso e profilo",
    intro: "I pezzi delle pagine di accesso, registrazione e profilo.",
    items: [
      {
        id: "intestazioni",
        title: "Logo e intestazioni",
        names: ["Logo", "PanelHero", "FormHeader", "FeatureRow"],
        description: "Il logo testuale ticly, il titolo grande del pannello sinistro, il titolo del modulo e le righe con icona.",
        stage: "start",
        preview: (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <Logo href="#" style={{ fontSize: "1.85rem", marginBottom: "1.5rem" }} />
              <PanelHero title="Bentornato nel tuo workspace." description="Un'unica identità crittografata." />
              <FeatureList>
                <FeatureRow icon={KeyRound} title="Passkey FIDO2 Native" description="Face ID o Touch ID" />
              </FeatureList>
            </div>
            <div>
              <FormHeader title="Accedi al tuo Account" description="Inserisci le tue credenziali per autenticarti">
                <AppRedirectChip name="ArcBase" logo="../../assets/arcbase-logo.png" />
              </FormHeader>
            </div>
          </div>
        ),
        code: `<Logo />
<PanelHero title="Bentornato nel tuo workspace." description="Un'unica identità crittografata." />
<FeatureList>
  <FeatureRow icon={KeyRound} title="Passkey FIDO2 Native" description="Face ID o Touch ID" />
</FeatureList>

<FormHeader title="Accedi al tuo Account" description="Inserisci le tue credenziali">
  <AppRedirectChip name="ticly music" logo="/logos/ticly-music.png" />
</FormHeader>`,
        props: [
          ["Logo.href", "string", "Default \"/\". Il testo di default è ticly."],
          ["FeatureRow.icon", "LucideIcon", "Icona nel quadratino a sinistra."],
          ["AppRedirectChip.name / logo", "string", "App verso cui si verrà reindirizzati (usa next/image)."],
        ],
      },
      {
        id: "account",
        title: "Account ricordato",
        names: ["AccountChip", "Alert", "FormFooter"],
        description: "Il saluto sopra il modulo quando l'account è già noto, l'errore animato e la riga per registrarsi.",
        stage: "start",
        preview: (
          <div style={{ maxWidth: 390 }}>
            <AccountChip name="Mario" email="mario.rossi@ticly.it" onChange={noop} />
            <Alert>Password non corretta. Riprova.</Alert>
            <FormFooter text="Non hai ancora un account?" linkLabel="Registrati gratis" href="#" />
          </div>
        ),
        code: `<AccountChip name="Mario" email="mario.rossi@ticly.it" onChange={usaAltroAccount} />
{errore && <Alert>{errore}</Alert>}
<FormFooter text="Non hai ancora un account?" linkLabel="Registrati gratis" href="/register" />`,
        props: [
          ["AccountChip.onChange", "() => void", "Mostra il pulsante Cambia."],
          ["AccountChip.greeting", "(name) => ReactNode", "Default \"Ciao, nome!\"."],
        ],
      },
      {
        id: "profilo",
        title: "Profilo e ricerca",
        names: ["ProfileHero", "SearchBar", "OverviewEmptyState"],
        description: "L'avatar grande con nome ed email e la ricerca a pillola con i risultati a tendina, come nella panoramica senza widget. Scrivi nella ricerca.",
        preview: <SearchDemo />,
        code: `<OverviewEmptyState>
  <ProfileHero name={user.name} email={user.email} avatarSrc={user.avatar} />
  <SearchBar value={query} onValueChange={setQuery} results={risultati} />
</OverviewEmptyState>`,
        props: [
          ["SearchBar.results", "{ id, icon?, title, description?, action }[]", "Se presente, mostra la tendina mentre si scrive."],
          ["ProfileHero.online", "boolean", "Pallino verde sull'avatar. Default true."],
        ],
      },
      {
        id: "sfondi",
        title: "Sfondi",
        names: ["WallpaperPicker", "WallpaperSwatch"],
        description: "La scelta dello sfondo del profilo, con le Dolomiti e il Nero Assoluto di login.",
        stage: "start",
        preview: <WallpaperDemo />,
        code: `const [sfondo, setSfondo] = useState("dolomiti")

<WallpaperPicker value={sfondo} onValueChange={setSfondo} />
<DesktopViewport wallpaper={getWallpaperStyle(sfondo)}>…</DesktopViewport>`,
      },
    ],
  },
  {
    id: "stati",
    title: "Stati e pannelli",
    intro: "Avvisi, indicatori, caricamento e pannelli che si aprono sopra i contenuti.",
    items: [
      {
        id: "avvisi",
        title: "Avvisi e indicatori",
        names: ["Notice", "StatusPill", "HealthBar", "Divider", "Spinner"],
        description: "Esiti dentro le sezioni, pillole di stato, la barra della salute dell'account (verde da 80, gialla da 50), il separatore Oppure e il caricamento.",
        stage: "start",
        preview: (
          <div style={{ display: "grid", gap: 4, maxWidth: 560 }}>
            <Notice>Passkey registrata con successo.</Notice>
            <Notice variant="error">Impossibile salvare le modifiche.</Notice>
            <div style={{ display: "flex", gap: 8, margin: "4px 0 8px" }}>
              <StatusPill active>2 Attive</StatusPill>
              <StatusPill>Inattiva</StatusPill>
            </div>
            <HealthBar value={80} style={{ marginTop: 0 }} />
            <HealthBar value={45} />
            <Divider />
            <Spinner label="Sincronizzazione workspace..." />
          </div>
        ),
        code: `<Notice>Passkey registrata con successo.</Notice>
<Notice variant="error">Impossibile salvare le modifiche.</Notice>
<StatusPill active>2 Attive</StatusPill>
<HealthBar value={80} />
<Divider />
<Spinner label="Sincronizzazione workspace..." />`,
        props: [
          ["Notice.variant", "\"success\" | \"error\"", "Verde o rosso."],
          ["StatusPill.active", "boolean", "Verde se attivo, grigio altrimenti."],
          ["HealthBar.value / label", "number / ReactNode", "Punteggio 0-100 ed etichetta."],
          ["Divider.label", "ReactNode", "Default \"Oppure\"."],
        ],
      },
      {
        id: "bottom-sheet",
        title: "Bottom sheet",
        names: ["BottomSheet"],
        description: "Il pannello che sale dal basso su mobile, con lo sfondo scuro. Si monta su <body>, quindi copre tutta la pagina.",
        preview: <SheetDemo />,
        code: `<BottomSheet open={open} onClose={() => setOpen(false)} aria-label="Personalizza">
  <DrawerHeader title="Personalizza" onClose={() => setOpen(false)} />
</BottomSheet>`,
      },
      {
        id: "standby",
        title: "Standby",
        names: ["Standby"],
        description: "L'orologio a tutto schermo sopra il wallpaper. Clicca per uscire.",
        stage: "full",
        preview: <StandbyDemo />,
        code: `<DesktopViewport>
  {standby ? (
    <Standby label="Dolomiti (Tramonto)" onExit={esci} onSettings={apriImpostazioni} />
  ) : (
    <AppWindow>…</AppWindow>
  )}
</DesktopViewport>`,
        props: [
          ["now", "Date", "Orario da mostrare; senza, un orologio interno aggiornato ogni secondo."],
          ["label", "ReactNode", "Capsula in basso a sinistra."],
          ["onExit / onSettings", "() => void", "Clic ovunque / pulsante in basso a destra."],
        ],
      },
    ],
  },
  {
    id: "widget",
    title: "Widget della dashboard",
    intro: "Copiati identici da login.ticly.it: tile in stile iOS con pressione lunga, trascinamento e ridimensionamento, il pannello di personalizzazione e i widget pronti.",
    items: [
      {
        id: "widget-tile",
        title: "Griglia di widget",
        names: ["WidgetTile", "WidgetContent"],
        description: "Ogni widget è un WidgetTile con dentro un WidgetContent. I dati arrivano da un unico oggetto ctx (utente, token, note…).",
        stage: "start",
        preview: <WidgetsDemo />,
        code: `<div className="dw-grid-container">
  <div className="dw-grid">
    {widgets.filter((w) => w.enabled).map((w) => (
      <WidgetTile key={w.id} widget={w} isEditMode={editing}
        isPressable={PRESSABLE_WIDGETS.has(w.id)}
        onDragStart={…} onDrag={…} onDragEnd={…}
        onRemove={…} onMove={…} onSizeChange={…}
        onResizeStart={…} onResizePreview={…} onResizeEnd={…}>
        <WidgetContent widget={w} ctx={ctx} />
      </WidgetTile>
    ))}
  </div>
</div>`,
      },
      {
        id: "widget-customizer",
        title: "Personalizzazione",
        names: ["WidgetCustomizer"],
        description: "Il pannello con i layout rapidi, l'elenco dei widget attivi e la galleria. Di solito sta in un Drawer accanto alla dashboard.",
        preview: <CustomizerDemo />,
        code: `<Drawer open={editing}>
  <WidgetCustomizer
    widgets={widgets}
    view={view}
    onViewChange={setView}
    renderPreview={(w) => <WidgetContent widget={w} ctx={ctx} />}
    onAdd={…} onRemove={…} onMove={…} onSizeChange={…}
    onReorderStart={…} onReorder={…} onReorderEnd={…}
    onApplyPreset={…} onReveal={…} onReset={…} onClose={…} onDone={…}
  />
</Drawer>`,
      },
      {
        id: "widget-extra",
        title: "Icone e angoli",
        names: ["WidgetSquircle", "InvertedCornerFillet"],
        description: "Le icone squircle colorate dei widget e l'angolo invertito in SVG.",
        preview: (
          <>
            <WidgetSquircle id="security" size={40} />
            <WidgetSquircle id="tokens" size={40} />
            <WidgetSquircle id="scratchpad" size={40} />
            <WidgetSquircle id="aiModels" size={40} />
            <InvertedCornerFillet size={28} color="#8c52ff" />
          </>
        ),
        code: `<WidgetSquircle id="security" size={40} />
<InvertedCornerFillet position="bottom-right" size={28} color="#8c52ff" />`,
      },
      {
        id: "manutenzione",
        title: "Manutenzione",
        names: ["MaintenanceGuard"],
        description: "Avvolge l'app e, se la manutenzione è attiva, mostra la schermata di manutenzione a chi non è amministratore. Usa le rotte di Next.js, per questo qui c'è solo il codice.",
        code: `// app/layout.tsx
<MaintenanceGuard isMaintenance={inManutenzione} isAdmin={isAdmin} message={messaggio}>
  {children}
</MaintenanceGuard>`,
      },
    ],
  },
];

/* ───────────── Pagina ───────────── */

function Sidebar_() {
  const ids = useMemo(() => SECTIONS.flatMap((s) => s.items.map((i) => i.id)), []);
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);

  return (
    <nav className="doc-side" aria-label="Indice">
      {SECTIONS.map((s) => (
        <div key={s.id}>
          <div className="doc-side-title">{s.title}</div>
          <ButtonGroup value={active} onValueChange={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })} aria-label={s.title}>
            {s.items.map((i) => (
              <ButtonGroupItem key={i.id} value={i.id}>
                {i.title}
                {i.deprecated && <small className="doc-side-deprecated">deprecato</small>}
              </ButtonGroupItem>
            ))}
          </ButtonGroup>
        </div>
      ))}
    </nav>
  );
}

function App() {
  // Il contenuto nasce dopo il caricamento: l'ancora dell'indirizzo va raggiunta a mano
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const go = () => document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
    requestAnimationFrame(go);
    // Font e immagini cambiano l'altezza della pagina: si ripete quando sono pronti
    document.fonts?.ready.then(go);
    window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);

  return (
    <>
      <header className="doc-top">
        <a className="doc-brand" href="../">
          arc UI <small>@arcbaseorg/ui</small>
        </a>
        <nav className="doc-top-links">
          <a href="/" className="doc-hide-sm">ArcBase</a>
          <a href="../">arc UI</a>
          <a href="https://github.com/arcbase-org/arc-ui" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.npmjs.com/package/@arcbaseorg/ui" target="_blank" rel="noopener noreferrer">npm</a>
        </nav>
      </header>
      <div className="doc-layout">
        <Sidebar_ />
        <main className="doc-main">
          <section className="doc-hero">
            <h1>
              <span>arc</span> UI
            </h1>
            <p>I componenti React di ArcBase: le finestre in vetro, i bottoni, le liste e i widget di login.ticly.it, pronti da installare. Open source con licenza AGPL-3.0.</p>
            <div className="doc-pills">
              <span className="doc-pill">React 19</span>
              <span className="doc-pill">Next.js 15+</span>
              <span className="doc-pill">TypeScript</span>
              <span className="doc-pill">Framer Motion</span>
              <span className="doc-pill">AGPL-3.0</span>
            </div>
          </section>
          <section className="doc-dolomiti" aria-labelledby="dolomiti-title">
            <img src="../../assets/arcui-card.png" alt="La scritta arc UI sulle Dolomiti al tramonto" />
            <div className="doc-dolomiti-text">
              <span className="doc-dolomiti-pill">Aggiornamento Dolomiti · 0.1</span>
              <h2 id="dolomiti-title">Una boccata d'aria fresca</h2>
              <p>
                Questo aggiornamento porta il nome delle Dolomiti, che fanno da sfondo alle finestre e alle anteprime di arc UI. Le abbiamo scelte perché arc UI vuole essere una boccata d'aria fresca per le interfacce, proprio come le Dolomiti.
              </p>
            </div>
          </section>
          {SECTIONS.map((s) => (
            <section key={s.id} className="doc-section" id={`sezione-${s.id}`}>
              <h2>{s.title}</h2>
              <p>{s.intro}</p>
              {s.items.map((item) => (
                <Item key={item.id} item={item} />
              ))}
            </section>
          ))}
        </main>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
