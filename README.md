<p align="center">
  <img src="https://raw.githubusercontent.com/arcbase-org/arc-ui/main/docs/arcui-banner.jpg" alt="La scritta arc UI sulle Dolomiti al tramonto" width="100%">
</p>

# arc UI

Componenti React in vetro per interfacce web: finestre e split window, sidebar con navigazione "corner game", bottoni connessi, liste a fisarmonica, avvisi, drawer e widget della dashboard in stile iOS.

Un progetto open source di ArcBase, sostenuto da [ticly](https://www.ticly.it).

<a href="https://buymeacoffee.com/arcbase"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Offrici un caffè su Buy Me a Coffee" height="48"></a>

> **Aggiornamento Dolomiti (0.1).** Le Dolomiti fanno da sfondo alle finestre e alle anteprime: le abbiamo scelte perché arc UI vuole essere una boccata d'aria fresca per le interfacce, proprio come le Dolomiti.

## Installazione

```bash
npm install @arcbaseorg/ui
```

Richiede React 19 e Next.js 15 o successivo. Non serve Tailwind.

## Configurazione

Importa gli stili una volta, nel layout principale:

```tsx
// app/layout.tsx
import "@arcbaseorg/ui/styles.css"
```

Gli sfondi predefiniti sono foto delle Dolomiti servite dal tuo sito: metti `dolomiti-default.jpg` nella cartella `public/`, oppure passa uno sfondo tuo con la prop `wallpaper` di `DesktopViewport` e `SplitWindow`.

I componenti hanno stato e animazioni: usali in componenti client. Il pacchetto è già marcato `"use client"`.

## Esempio

Una pagina di accesso con la split window:

```tsx
"use client"

import { KeyRound, Mail } from "lucide-react"
import { SplitWindow, Logo, PanelHero, FeatureList, FeatureRow, FormHeader, Field, Input, PasswordInput, Button, Divider } from "@arcbaseorg/ui"

export default function Accesso() {
  return (
    <SplitWindow
      left={
        <>
          <div>
            <Logo style={{ fontSize: "1.85rem", marginBottom: "2rem" }} />
            <PanelHero title="Bentornato nel tuo workspace." description="Un'unica identità per tutti i servizi." />
          </div>
          <FeatureList>
            <FeatureRow icon={KeyRound} title="Passkey FIDO2" description="Face ID o Touch ID" />
          </FeatureList>
        </>
      }
      right={
        <form>
          <FormHeader title="Accedi al tuo Account" description="Inserisci le tue credenziali" />
          <Field label="Email"><Input icon={Mail} placeholder="nome@esempio.it" /></Field>
          <Field label="Password"><PasswordInput placeholder="••••••••••••" /></Field>
          <Button type="submit" size="lg" block>Accedi</Button>
          <Divider />
          <Button variant="secondary" block>Accedi con Passkey</Button>
        </form>
      }
    />
  )
}
```

Bottoni connessi e liste:

```tsx
import { ButtonGroup, ButtonGroupItem, List, ListItem, Price, Tag, Button, CheckList } from "@arcbaseorg/ui"

<ButtonGroup orientation="horizontal" defaultValue="mese">
  <ButtonGroupItem value="mese">Mese</ButtonGroupItem>
  <ButtonGroupItem value="anno">Anno</ButtonGroupItem>
</ButtonGroup>

<List>
  <ListItem title="Lingua" trailing="Italiano" />
  <ListItem tone="pro" leading={<Price value="€9" />} title="Pro" badges={<Tag>Consigliato</Tag>} trailing={<Button size="sm">Scegli</Button>}>
    <CheckList items={["5 Spaces", "Modelli avanzati"]} />
  </ListItem>
</List>
```

## Componenti

**Finestre e layout** — `DesktopViewport`, `SplitWindow`, `AppWindow`, `MainContent`, `Sidebar` con `SidebarNav`, `SidebarNavItem`, `SidebarFooter`, `SidebarUser`, `SidebarLogout` e `TokenBox`, `MobileHeaderBar`, `View`, `ViewHeader`, `GlassPanel`, `ModularPanel`, `CornerGroup`.

**Controlli** — `Button`, `ButtonLink`, `ButtonGroup`, `ButtonGroupItem`, `CtaButton`, `CtaLink`, `CirButton`, `IconButton`, `Field`, `Input`, `PasswordInput`, `CodeInput`, `CirTabs` (deprecato: usa `ButtonGroup`).

**Liste** — `List` e `ListItem` (varianti `stack` e `compact`; righe statiche, cliccabili o a fisarmonica; colori per piano), `Price`, `Tag`, `AccordionText`, `CheckList`, `AccordionFooter`, `ListRowGroup`, `ListRow`, `ListEmpty`, `DetailRow`, `Metric`.

**Accesso e profilo** — `Logo`, `PanelHero`, `FormHeader`, `FeatureList`, `FeatureRow`, `AccountChip`, `AppRedirectChip`, `FormFooter`, `ProfileHero`, `WallpaperPicker`, `WallpaperSwatch`.

**Stati e pannelli** — `Alert`, `Notice`, `StatusPill`, `HealthBar`, `Divider`, `Spinner`, `SearchBar`, `OverviewEmptyState`, `Drawer`, `DrawerHeader`, `DrawerSectionTitle`, `BottomSheet`, `BackupCodes`, `Standby`.

**Widget della dashboard** — `WidgetTile`, `WidgetContent`, `WidgetCustomizer`, `WidgetSquircle`, `InvertedCornerFillet`, `MaintenanceGuard`.

**Dati e utilità** — `WALLPAPER_PRESETS`, `getWallpaperStyle`, `DEFAULT_DASHBOARD_WIDGETS`, `PLANS`, `AI_MODELS`, `hasTierAccess`, `GLASS_BLUR`.

Tutti i componenti sono in TypeScript: l'editor mostra props e descrizioni.

## Sviluppo

```bash
git clone https://github.com/arcbase-org/arc-ui.git
cd arc-ui
npm install
npm run typecheck
npm run build
```

La build genera `dist/` con il codice ESM, i tipi e `styles.css`. La documentazione con le anteprime dal vivo si compila con `npm run docs -- --out <cartella>`.

## Sostieni il progetto

arc UI è gratuito e open source. Se ti è utile, [offrici un caffè su Buy Me a Coffee](https://buymeacoffee.com/arcbase): ci aiuta a continuare a svilupparlo.

## Licenza

[GNU AGPL-3.0](LICENSE)
