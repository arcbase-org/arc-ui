// Barra di ricerca della panoramica di login.ticly.it, con i risultati a tendina
import { ArrowUpRight, Search, X } from "lucide-react";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cx } from "../lib/cx";

export interface SearchResult {
  id: string;
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action: () => void;
}

export interface SearchBarProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  /** Se presente, mostra la tendina dei risultati mentre si scrive */
  results?: SearchResult[];
  resultsLabel?: ReactNode;
  style?: CSSProperties;
}

/** Campo di ricerca a pillola (`.overview-search-bar`) con risultati (`.search-results-dropdown`) */
export function SearchBar({ value, onValueChange, placeholder = "Cerca app, impostazioni o informazioni...", results, resultsLabel = "Risultati", style }: SearchBarProps) {
  return (
    <div style={{ width: "100%", maxWidth: "480px", marginBottom: "1.5rem", position: "relative", ...style }}>
      <div className="overview-search-bar">
        <Search size={18} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }} />
        <input type="text" value={value} onChange={(e) => onValueChange(e.target.value)} placeholder={placeholder} className="overview-search-input" />
        {value && (
          <button
            type="button"
            onClick={() => onValueChange("")}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "4px", display: "flex" }}
            title="Cancella ricerca"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {results && value.trim().length > 0 && (
        <div className="search-results-dropdown">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.72rem", color: "#888", fontWeight: 600, textTransform: "uppercase" }}>
              {resultsLabel} ({results.length})
            </span>
            <button type="button" onClick={() => onValueChange("")} style={{ background: "none", border: "none", color: "#888", fontSize: "0.7rem", cursor: "pointer" }}>
              Chiudi
            </button>
          </div>

          {results.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "10px", cursor: "pointer", textAlign: "left", color: "#fff", width: "100%" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    {item.icon && <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>{item.title}</div>
                      {item.description && <div style={{ fontSize: "0.72rem", color: "#888" }}>{item.description}</div>}
                    </div>
                  </div>
                  <ArrowUpRight size={14} style={{ color: "#888" }} />
                </button>
              ))}
            </div>
          ) : (
            <div style={{ padding: "1rem", textAlign: "center", color: "#888", fontSize: "0.8rem" }}>
              Nessun risultato trovato per &quot;{value}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Contenitore centrato della panoramica senza widget (`.overview-empty-state`) */
export function OverviewEmptyState({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("overview-empty-state", className)} {...props} />;
}
