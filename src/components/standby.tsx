// Modalità standby di login.ticly.it: orologio a tutto schermo sopra il wallpaper
import { motion } from "framer-motion";
import { Compass, SlidersHorizontal } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export interface StandbyProps {
  /** Orario da mostrare; se manca usa un orologio interno aggiornato ogni secondo */
  now?: Date;
  /** Capsula in basso a sinistra, es. il nome del wallpaper */
  label?: ReactNode;
  hint?: ReactNode;
  /** Clic in un punto qualsiasi */
  onExit?: () => void;
  /** Pulsante in basso a destra */
  onSettings?: () => void;
  settingsLabel?: ReactNode;
}

/** Orologio grande con data e barra in basso (`.standby-fullscreen-overlay`) */
export function Standby({ now, label, hint = "Fai clic ovunque per riaprire", onExit, onSettings, settingsLabel = "Impostazioni Account" }: StandbyProps) {
  // L'orologio parte dopo il montaggio, per non dare mismatch tra server e browser
  const [clock, setClock] = useState<Date | null>(null);
  useEffect(() => {
    if (now) return;
    setClock(new Date());
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, [now]);
  const currentTime = now ?? clock;

  return (
    <motion.div
      key="standby-ambient-hud"
      initial={{ opacity: 0, scale: 0.98, filter: "blur(14px)" }}
      // Come AppWindow: niente filtro residuo, o la capsula e il pulsante perdono il blur
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      exit={{ opacity: 0, scale: 0.96, filter: "blur(16px)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="standby-fullscreen-overlay"
      onClick={onExit}
    >
      <div style={{ height: "40px" }} />

      <div className="standby-hero-clock">
        <div className="standby-time-huge">
          <span>{currentTime ? currentTime.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : "--:--"}</span>
          <span className="standby-seconds-quiet">:{currentTime ? currentTime.getSeconds().toString().padStart(2, "0") : "--"}</span>
        </div>
        <div className="standby-date-elegant">
          {currentTime ? currentTime.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" }) : " "}
        </div>
      </div>

      <div className="standby-footer-dock">
        {label ? (
          <div className="standby-micro-capsule" onClick={(e) => e.stopPropagation()}>
            <Compass size={13} style={{ color: "#38bdf8" }} />
            <span>{label}</span>
          </div>
        ) : (
          <div />
        )}

        <div className="standby-hint-center">{hint}</div>

        {onSettings ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSettings();
            }}
            className="standby-action-btn"
            title="Riapri impostazioni profilo e aspetto"
          >
            <SlidersHorizontal size={14} />
            <span>{settingsLabel}</span>
          </button>
        ) : (
          <div />
        )}
      </div>
    </motion.div>
  );
}
