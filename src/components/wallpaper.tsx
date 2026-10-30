// Scelta dello sfondo del profilo di login.ticly.it
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { cx } from "../lib/cx";
import { WALLPAPER_PRESETS, type WallpaperPreset } from "../lib/wallpapers";

export interface WallpaperSwatchProps {
  name: ReactNode;
  /** Sfondo CSS dell'anteprima */
  preview: string;
  active?: boolean;
  onSelect?: () => void;
  style?: CSSProperties;
}

/** Anteprima di uno sfondo selezionabile (`.wallpaper-swatch`) */
export function WallpaperSwatch({ name, preview, active, onSelect, style }: WallpaperSwatchProps) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={!!active}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={cx("wallpaper-swatch", active && "active")}
      style={{ background: preview, ...style }}
    >
      <span className="wallpaper-swatch-label">{name}</span>
    </div>
  );
}

export interface WallpaperPickerProps {
  presets?: WallpaperPreset[];
  /** id dello sfondo selezionato */
  value?: string;
  onValueChange?: (id: string) => void;
}

/** Griglia di WallpaperSwatch con gli sfondi di login (Dolomiti, Nero Assoluto…) */
export function WallpaperPicker({ presets = WALLPAPER_PRESETS, value, onValueChange }: WallpaperPickerProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", marginBottom: "0.5rem" }}>
      {presets.map((wp) => (
        <WallpaperSwatch key={wp.id} name={wp.name} preview={wp.preview} active={value === wp.id} onSelect={() => onValueChange?.(wp.id)} />
      ))}
    </div>
  );
}
