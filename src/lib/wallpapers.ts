export interface WallpaperPreset {
  id: string;
  name: string;
  style: string;
  preview: string;
}

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: "dolomiti",
    name: "Dolomiti (Tramonto)",
    style: "linear-gradient(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.36)), url('/dolomiti-default.jpg') center/cover no-repeat, #07090e",
    preview: "url('/dolomiti-default.jpg') center/cover",
  },
  {
    id: "dolomiti-tre-cime",
    name: "Dolomiti (Tre Cime)",
    style: "linear-gradient(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.36)), url('/dolomiti-tre-cime.jpg') center/cover no-repeat, #07090e",
    preview: "url('/dolomiti-tre-cime.jpg') center/cover",
  },
  {
    id: "dolomiti-kronplatz",
    name: "Dolomiti (Kronplatz)",
    style: "linear-gradient(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.36)), url('/dolomiti-kronplatz.jpg') center/cover no-repeat, #07090e",
    preview: "url('/dolomiti-kronplatz.jpg') center/cover",
  },
  {
    id: "dolomiti-sassolungo",
    name: "Dolomiti (Sassolungo)",
    style: "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.38)), url('/dolomiti.jpg') center/cover no-repeat, #07090e",
    preview: "url('/dolomiti.jpg') center/cover",
  },
  {
    id: "dolomiti-night",
    name: "Dolomiti Notturne",
    style: "linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2560&q=85') center/cover no-repeat, #05060a",
    preview: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=60') center/cover",
  },
  {
    id: "pure-obsidian",
    name: "Nero Assoluto",
    style: "#000000",
    preview: "#000000",
  },
];

export const DEFAULT_WALLPAPER_STYLE = WALLPAPER_PRESETS[0].style;

export function getWallpaperStyle(savedIdOrUrl?: string | null): string {
  if (!savedIdOrUrl) return DEFAULT_WALLPAPER_STYLE;
  if (savedIdOrUrl.startsWith("http") || savedIdOrUrl.startsWith("url(")) {
    return `url("${savedIdOrUrl}") center/cover no-repeat, #07090e`;
  }
  if (savedIdOrUrl === "dolomiti-sunset") {
    return "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.38)), url('/dolomiti.jpg') center/cover no-repeat, #07090e";
  }
  const match = WALLPAPER_PRESETS.find(w => w.id === savedIdOrUrl);
  return match ? match.style : DEFAULT_WALLPAPER_STYLE;
}
