import type { CSSProperties } from "react"

/** Vetro sfocato che login.ticly.it applica a pannelli, sidebar, contenuto e drawer */
export const GLASS_BLUR: CSSProperties = {
  backdropFilter: "blur(32px) saturate(190%)",
  WebkitBackdropFilter: "blur(32px) saturate(190%)",
}
